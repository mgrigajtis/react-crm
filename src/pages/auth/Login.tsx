import { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google'; // Ensure this is the correct import
import { useNavigate } from 'react-router-dom';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/img_logo.png';
import imgLogin from '../../assets/images/auth/img_login.png';
import { GoogleButton } from '../../styles/CssStyled';
import { fetchData } from '../../components/FetchData';
import { AuthUrl } from '../../services/ApiUrls';
import '../../styles/style.css';

export default function Login() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null); // Changed from false to null for clarity

    useEffect(() => {
        const storedToken = localStorage.getItem('Token');
        if (storedToken) {
            navigate('/app');
        }
    }, []); // Removed token from dependency array

    const onSuccess = (tokenResponse: { access_token: any; }) => {
        const apiToken = { token: tokenResponse.access_token };
        const head = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetchData(`${AuthUrl}/`, 'POST', JSON.stringify(apiToken), head)
            .then((res) => {
                localStorage.setItem('Token', `Bearer ${res.access_token}`);
                setToken(res.access_token); // Updated to set the actual token
                navigate('/app'); // Navigate on successful authentication
            })
            .catch((error) => {
                console.error('Error:', error);
                // Optionally update UI to reflect error
            });
    };

    const loginOptions = { client_id: "your-client-id-here", onSuccess }; // Ensure all required options are correctly set
    const login = useGoogleLogin(loginOptions);

    return (
        <div>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='center'
                alignItems='center'
                sx={{ height: '100%', width: '100%', position: 'fixed' }}
            >
                <Grid
                    container
                    item
                    xs={8}
                    direction='column'
                    justifyContent='space-evenly'
                    alignItems='center'
                    sx={{ height: '100%', overflow: 'hidden' }}
                >
                    <Grid item>
                        <img src={imgLogo} alt='register_logo' className='register-logo' />
                        <Typography variant='h5' style={{ fontWeight: 'bolder' }}>Sign In</Typography>
                        <GoogleButton variant='outlined' onClick={() => login()} sx={{ mt: 4, fontSize: '12px', fontWeight: 500 }}>
                            Sign in with Google
                            <img src={imgGoogle} alt='google' style={{ width: '17px', marginLeft: '5px' }} />
                        </GoogleButton>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={8}
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                    className='rightBg'
                    sx={{ height: '100%', overflow: 'hidden', justifyItems: 'center' }}
                >
                    <Grid item >
                        <Stack sx={{ alignItems: 'center' }}>
                            <h3>Welcome to BottleCRM</h3>
                            <p>Free and OpenSource CRM for small medium business.</p>
                            <img
                                src={imgLogin}
                                alt='register_ad_image'
                                className='register-ad-image'
                            />
                            <footer className='register-footer'>
                                bottlecrm.com
                            </footer>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </div>
    );
}
