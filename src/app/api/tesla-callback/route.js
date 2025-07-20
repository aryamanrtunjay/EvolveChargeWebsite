import { NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '../../../firebaseConfig.js';
import { doc, updateDoc } from 'firebase/firestore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // userId from state

  if (!code || !state) {
    return NextResponse.redirect('/signup?error=Authorization failed');
  }

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_TESLA_CLIENT_ID,
        client_secret: process.env.TESLA_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:3000/api/tesla-callback', // Update for prod
        audience: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Fetch vehicles using access token
    const vehiclesResponse = await axios.get(
      'https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const vehicles = vehiclesResponse.data.response;
    const vin = vehicles[0]?.vin; // Assume first vehicle

    // Update user in Firebase
    const userRef = doc(db, 'users', state);
    await updateDoc(userRef, {
      tesla_access_token: access_token,
      tesla_refresh_token: refresh_token,
      tesla_token_expires: Date.now() + expires_in * 1000,
      tesla_vehicle_vin: vin,
    });

    // Redirect back with success (show modal in UI if needed)
    return NextResponse.redirect('/signup?success=true');
  } catch (error) {
    console.error(error);
    return NextResponse.redirect('/signup?error=Pairing failed');
  }
}