import { useEffect, useState } from 'react';
import { Button, Grid, Stack, Typography, Input } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google'; // Ensure this is the correct import
import { useNavigate } from 'react-router-dom';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/img_logo.png';
import imgLogin from '../../assets/images/auth/img_login.png';
import { GoogleButton } from '../../styles/CssStyled';
import { fetchData } from '../../components/FetchData';
import { LoginUrl } from '../../services/ApiUrls';
import '../../styles/style.css';

export default function Login() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null); // Changed from false to null for clarity
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('Token');
        if (storedToken) {
            navigate('/app');
        }
    }, []); // Removed token from dependency array

    const onSuccess = () => {
        const user = { email, password };
        const head = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        console.log(`${LoginUrl}/`);
        fetchData(`${LoginUrl}/`, 'POST', JSON.stringify(user), head)
            .then((res) => {
                if (res.status === 200) { // Check if the response status is OK
                    return res
                } else {
                    throw new Error('Authentication failed'); // Throw an error if the status is not OK
                }
            })
            .then((data) => {
                localStorage.setItem('Token', `Bearer ${data.access_token}`);
                setToken(data.access_token); // Updated to set the actual token
                navigate('/app'); // Navigate on successful authentication
            })
            .catch((error) => {
                console.error('Error:', error);
                // Optionally update UI to reflect error
            });
    };

    const handleLogin = async (event:any) => {event.preventDefault(); onSuccess()}

    return (
        <div style={{width: "100%"}}>
        <Grid
            container
            item
            direction='column'
            justifyContent='center'
            alignItems='center'
            sx={{ height: '100%', overflow: 'hidden', width: '100%' }}
        >
            <Typography variant='h5' style={{ fontWeight: 'bolder', marginBottom: 24 }}>Login</Typography>
            <form onSubmit={handleLogin} style={{width: "55%"}}>
            <Grid
                container
                item
                direction='column'
                justifyContent='center'
                alignItems='center'
                sx={{ height: '100%', width: "100%", overflow: 'hidden' }}
            >   
                <Grid container item justifyContent="space-between" alignItems="end"  style = {{marginBottom: 32}}>
                    <label>Email:</label>
                    <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </Grid>
                <Grid container item justifyContent="space-between" alignItems="end"  style = {{marginBottom: 40}}>
                    <label>Password:</label>
                    <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </Grid>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button variant='outlined' type="submit" sx={{ mt: 2, mb: 2, fontSize: '12px', fontWeight: 500, display: 'block', margin: '0 auto'}}>Login</Button>
            </Grid>
            </form>
      </Grid>
      </div>
    );
}
