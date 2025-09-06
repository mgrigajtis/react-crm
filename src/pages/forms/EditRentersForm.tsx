import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    TextField,
    FormControl,
    TextareaAutosize,
    AccordionDetails,
    Accordion,
    AccordionSummary,
    Typography,
    Box,
    MenuItem,
    InputAdornment,
    Chip,
    Autocomplete,
    FormHelperText,
    IconButton,
    Select,
    Divider
} from '@mui/material'
import '../../styles/style.css'
import { AccountsUrl } from '../../services/ApiUrls'
import { fetchData } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaFileUpload, FaPlus, FaTimes, FaUpload } from 'react-icons/fa'
import { AntSwitch, CustomPopupIcon, RequiredSelect, RequiredTextField } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'


type RentersFormErrors = {
    id?: string[],
    secondary_owner_name?: string[],
    secondary_owner_date_of_birth?: string[],
    secondary_owner_email?: string[],
    lease_start_date?: string[],
    limit_of_coverage_desired?: string[],
    has_dogs?: string[],
    number_of_dogs?: string[],
    dog_breeds?: string[],
};

interface RentersFormData {
    id: string,
    secondary_owner_name: string,
    secondary_owner_date_of_birth: string,
    secondary_owner_email: string,
    lease_start_date: string,
    limit_of_coverage_desired: boolean,
    has_dogs: boolean,
    number_of_dogs: number | null,
    dog_breeds: string,
}

export function EditRentersForm() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const autocompleteRef = useRef<any>(null);
    const [error, setError] = useState(false)
    const [reset, setReset] = useState(false)
    const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
    const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any[]>([]);
    const [leadSelectOpen, setLeadSelectOpen] = useState(false)
    const [statusSelectOpen, setStatusSelectOpen] = useState(false)
    const [countrySelectOpen, setCountrySelectOpen] = useState(false)
    const [contactSelectOpen, setContactSelectOpen] = useState(false)


    const [errors, setErrors] = useState<RentersFormErrors>({});
    const [formData, setFormData] = useState<RentersFormData>({
        id: '',
        secondary_owner_name: '',
        secondary_owner_date_of_birth: '',
        secondary_owner_email: '',
        lease_start_date: '',
        limit_of_coverage_desired: false,
        has_dogs: false,
        number_of_dogs: null,
        dog_breeds: '',
    })

    useEffect(() => {
        setFormData(state?.value)
    }, [state?.id])

    console.log(formData)

    useEffect(() => {
        if (reset) {
            console.log("setting form data")
            setFormData(state?.value)
        }
        return () => {
            setReset(false)
        }
    }, [reset])

    const backbtnHandle = () => {
        if (state?.edit) {
            navigate('/app/accounts')
        } else {
            // Values were lost once transitioning through multiple components resulting in a screen error, 
            // added aditional fileds for consistency with other components as a fix
            // Every component that returns to account details has to pass the same fields back, otherwise edit page will break
            navigate('/app/accounts/account-details', { state: { accountId: state?.account.id, detail: true, contacts: state?.contacts || [], status: state?.status || [], tags: state?.tags || [], users: state?.users || [], countries: state?.countries || [], teams: state?.teams || [], leads: state?.leads || []} })
        }
    }
    // const handleChange2 = (title: any, val: any) => {
    //     if (title === 'contacts') {
    //         setFormData({ ...formData, contacts: val.length > 0 ? val.map((item: any) => item.id) : [] });
    //         setSelectedContacts(val);
    //     } else if (title === 'assigned_to') {
    //         setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] });
    //         setSelectedAssignTo(val);
    //     } else if (title === 'tags') {
    //         setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] });
    //         setSelectedTags(val);
    //     } else if (title === 'teams') {
    //         setFormData({ ...formData, teams: val.length > 0 ? val.map((item: any) => item.id) : [] });
    //         setSelectedTags(val);
    //     }
    //     else {
    //         setFormData({ ...formData, [title]: val })
    //     }
    // }
    const handleChange = (e: any) => {
        const { name, value, files, type, checked, id } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: e.target.files?.[0] || null });
        }
        else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };
    // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0] || null;
    //     if (file) {
    //         setFormData({ ...formData, account_attachment: file?.name })
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             setFormData({ ...formData, file: reader.result as string });
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };
    // const handleFileChange = (event: any) => {
    //     const file = event.target.files?.[0] || null;
    //     if (file) {
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             account_attachment: file.name,
    //             file: prevData.file,
    //         }));

    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             setFormData((prevData) => ({
    //                 ...prevData,
    //                 file: reader.result as string,
    //             }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        submitForm();
    }
    const submitForm = () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
          }
        // console.log('Form data:', formData.lead_attachment,'sfs', formData.file);
        const data = {
            account: state?.account.id,
            secondary_owner_name: formData.secondary_owner_name,
            secondary_owner_date_of_birth: formData.secondary_owner_date_of_birth,
            secondary_owner_email: formData.secondary_owner_email,
            lease_start_date: formData.lease_start_date,
            limit_of_coverage_desired: formData.limit_of_coverage_desired,
            has_dogs: formData.has_dogs,
            number_of_dogs: formData.number_of_dogs,
            dog_breeds: formData.dog_breeds,
        }

        fetchData(`${AccountsUrl}/renters-form/${formData.id}/`, 'PUT', JSON.stringify(data), Header)
            .then((res: any) => {
                // console.log('Form data:', res);
                if (!res.error) {
                    resetForm()
                    navigate('/app/accounts')
                }
                if (res.error) {
                    setError(true)
                    setErrors(res?.errors)
                }
            })
            .catch(() => {
            })
    };
    const resetForm = () => {
        setFormData({
            id: '',
            secondary_owner_name: '',
            secondary_owner_date_of_birth: '',
            secondary_owner_email: '',
            lease_start_date: '',
            limit_of_coverage_desired: false,
            has_dogs: false,
            number_of_dogs: null,
            dog_breeds: '',
        });
        setErrors({})
    }
    const onCancel = () => {
        // resetForm()
        setReset(true)
    }


    const module = 'Accounts'
    const crntPage = 'Add Account'
    const backBtn = state?.edit ? 'Back to Accounts' : 'Back to AccountDetails'

    // console.log(state, 'accountform')
    return (
        <Box sx={{ mt: '60px' }}>
            <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} onCancel={onCancel} onSubmit={handleSubmit} />
            <Box sx={{ mt: "120px" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: '10px' }}>
                        <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Account Information</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                <Box>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Lease Start Date</div>
                                            <FormControl error={!!errors?.lease_start_date?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'date'}
                                                    name='lease_start_date'
                                                    value={formData.lease_start_date}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.lease_start_date?.[0] ? errors?.lease_start_date[0] : ''}
                                                    error={!!errors?.lease_start_date?.[0]}
                                                    sx={{
                                                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                                            backgroundColor: 'whitesmoke',
                                                            padding: '13px',
                                                            marginRight: '-15px'
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Secondary Owner Name</div>
                                            <FormControl error={!!errors?.secondary_owner_name?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='secondary_owner_name'
                                                    value={formData.secondary_owner_name}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.secondary_owner_name?.[0] ? errors?.secondary_owner_name[0] : ''}
                                                    error={!!errors?.secondary_owner_name?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Secondary Owner Email</div>
                                            <FormControl error={!!errors?.secondary_owner_email?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='secondary_owner_email'
                                                    value={formData.secondary_owner_email}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.secondary_owner_email?.[0] ? errors?.secondary_owner_email[0] : ''}
                                                    error={!!errors?.secondary_owner_email?.[0]}
                                                />
                                                <FormHelperText>{errors?.secondary_owner_email?.[0] || ''}</FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Secondary Owner Date of Birth</div>
                                            <FormControl error={!!errors?.secondary_owner_date_of_birth?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'date'}
                                                    name='secondary_owner_date_of_birth'
                                                    value={formData.secondary_owner_date_of_birth}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.secondary_owner_date_of_birth?.[0] ? errors?.secondary_owner_date_of_birth[0] : ''}
                                                    error={!!errors?.secondary_owner_date_of_birth?.[0]}
                                                    sx={{
                                                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                                            backgroundColor: 'whitesmoke',
                                                            padding: '13px',
                                                            marginRight: '-15px'
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Desired Limit of Coverage</div>
                                            <FormControl error={!!errors?.limit_of_coverage_desired?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                name='limit_of_coverage_desired'
                                                checked={formData.limit_of_coverage_desired}
                                                // onChange={handleChange}
                                                onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, limit_of_coverage_desired: e.target.checked })) }}
                                                sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Has Dog</div>
                                            <FormControl error={!!errors?.has_dogs?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                name='has_dogs'
                                                checked={formData.has_dogs}
                                                // onChange={handleChange}
                                                onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, has_dogs: e.target.checked })) }}
                                                sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Number of Dogs</div>
                                            <FormControl error={!!errors?.number_of_dogs?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='number_of_dogs'
                                                    value={formData.number_of_dogs}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.number_of_dogs?.[0] ? errors?.number_of_dogs[0] : ''}
                                                    error={!!errors?.number_of_dogs?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>

                                        </div>
                                    </div>
                                </Box>
                            </AccordionDetails>
                            </Accordion>
                        </div >
                    </div >
                </form >
            </Box >
        </Box >
    )
}
