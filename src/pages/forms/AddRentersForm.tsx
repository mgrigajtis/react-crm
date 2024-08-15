import React, { ChangeEvent, useRef, useState, useEffect } from 'react'
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
    Divider,
    Button,
    Snackbar,
    Alert,
} from '@mui/material'
import '../../styles/style.css'
import { AccountsUrl } from '../../services/ApiUrls'
import { fetchData } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaCheckCircle, FaTimesCircle, FaFileUpload, FaPlus, FaTimes, FaUpload } from 'react-icons/fa'
import { CustomPopupIcon, RequiredSelect, RequiredTextField, AntSwitch } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import { useQuill } from 'react-quilljs';


type RentersFormErrors = {
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
    secondary_owner_name: string,
    secondary_owner_date_of_birth: string,
    secondary_owner_email: string,
    lease_start_date: string,
    limit_of_coverage_desired: boolean,
    has_dogs: boolean,
    number_of_dogs: number | null,
    dog_breeds: string,
}

export function AddRentersForm() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { quill, quillRef } = useQuill();
    const initialContentRef = useRef(null);

    const autocompleteRef = useRef<any>(null);
    const [error, setError] = useState(false)
    const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
    const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any[]>([]);
    const [leadSelectOpen, setLeadSelectOpen] = useState(false)
    const [currencySelectOpen, setCurrencySelectOpen] = useState(false)
    const [stageSelectOpen, setStageSelectOpen] = useState(false)
    const [contactSelectOpen, setContactSelectOpen] = useState(false)
    const [accountSelectOpen, setAccountSelectOpen] = useState(false)

    const [errors, setErrors] = useState<RentersFormErrors>({});
    const [formData, setFormData] = useState<RentersFormData>({
        secondary_owner_name: '',
        secondary_owner_date_of_birth: '',
        secondary_owner_email: '',
        lease_start_date: '',
        limit_of_coverage_desired: false,
        has_dogs: false,
        number_of_dogs: null,
        dog_breeds: '',
    })

    const handleChange2 = (title: any, val: any) => {
            setFormData({ ...formData, [title]: val })
    }
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
        console.log(formData)
    };
    const backbtnHandle = () => {
        console.log(state)
        navigate('/app/accounts/account-details', { state: { accountId: state?.account.id, detail: true }})
    }
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
        console.log(data)
        fetchData(`${AccountsUrl}/renters-intake/`, 'POST', JSON.stringify(data), Header)
            .then((res: any) => {
                // console.log('Form data:', res);
                if (!res.error) {
                    resetForm()
                    console.log(state)
                    navigate('/app/accounts/account-details', { state: { accountId: state?.account.id, detail: true }})
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
        setSelectedContacts([]);
        setSelectedAssignTo([])
        setSelectedTags([])
        setSelectedTeams([])
    }
    const onCancel = () => {
        resetForm()
    }

    const resetQuillToInitialState = () => {
        // Reset the Quill editor to its initial state
        setFormData({ ...formData })
        if (quill && initialContentRef.current !== null) {
            quill.clipboard.dangerouslyPasteHTML(initialContentRef.current);
        }
    };

    const module = 'Accounts'
    const crntPage = 'Add Intake Form'
    const backBtn = 'Back To Account Details'

    // console.log(formData, 'leadsform')
    return (
        <Box sx={{ mt: '60px' }}>
        <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} onCancel={onCancel} onSubmit={handleSubmit} />
        <Box sx={{ mt: "120px" }}>
            <form onSubmit={handleSubmit}>
                <div style={{ padding: '10px' }}>
                    <div className='leadContainer'>
                        <Accordion defaultExpanded style={{ width: '98%' }}>
                            <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                <Typography className='accordion-header'>Add Rental Intake Form</Typography>
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
                    </div>
                </div>
            </form>
        </Box>
    </Box >
    )
}
