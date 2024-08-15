import React, { ChangeEvent, useRef, useState } from 'react'
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
import { CustomPopupIcon, RequiredSelect, RequiredTextField } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'



type FormErrors = {
    name?: string[],
    phone?: string[],
    email?: string[],
    billing_address_line?: string[],
    billing_street?: string[],
    billing_city?: string[],
    billing_state?: string[],
    billing_postcode?: string[],
    billing_country?: string[],
    contact_name?: string[],
    previous_residency_address_line?: string[],
    previous_residency_street?: string[],
    previous_residency_city?: string[],
    previous_residency_state?: string[],
    previous_residency_postcode?: string[],
    previous_residency_country?: string[],
    teams?: string[],
    assigned_to?: string[],
    tags?: string[],
    account_attachment?: string[],
    website?: string[],
    status?: string[],
    lead?: string[],
    contacts?: string[],
    file?: string[]
    date_of_birth?: string[]

};
interface FormData {
    name: string,
    phone: string,
    email: string,
    billing_address_line: string,
    billing_street: string,
    billing_city: string,
    billing_state: string,
    billing_postcode: string,
    billing_country: string,
    previous_residency_address_line: string,
    previous_residency_street: string,
    previous_residency_city: string,
    previous_residency_state: string,
    previous_residency_postcode: string,
    previous_residency_country: string,
    contact_name: string,
    teams: string[],
    assigned_to: string[],
    tags: string[],
    account_attachment: string | null,
    website: string,
    status: string,
    lead: string,
    contacts: [],
    file?: string | null,
    date_of_birth: Date | null,
}

export function AddAccount() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const autocompleteRef = useRef<any>(null);
    const [error, setError] = useState(false)
    const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
    const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any[]>([]);
    const [leadSelectOpen, setLeadSelectOpen] = useState(false)
    const [statusSelectOpen, setStatusSelectOpen] = useState(false)
    const [countrySelectOpen, setCountrySelectOpen] = useState(false)
    const [contactSelectOpen, setContactSelectOpen] = useState(false)

    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        email: '',
        billing_address_line: '',
        billing_street: '',
        billing_city: '',
        billing_state: '',
        billing_postcode: '',
        billing_country: '',
        previous_residency_address_line: '',
        previous_residency_street: '',
        previous_residency_city: '',
        previous_residency_state: '',
        previous_residency_postcode: '',
        previous_residency_country: '',
        contact_name: '',
        teams: [],
        assigned_to: [],
        tags: [],
        account_attachment: null,
        website: '',
        status: 'open',
        lead: '',
        contacts: [],
        file: null,
        date_of_birth: null,
    })

    const handleChange2 = (title: any, val: any) => {
        if (title === 'contacts') {
            setFormData({ ...formData, contacts: val.length > 0 ? val.map((item: any) => item.id) : [] });
            setSelectedContacts(val);
        } else if (title === 'assigned_to') {
            setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] });
            setSelectedAssignTo(val);
        } else if (title === 'tags') {
            setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] });
            setSelectedTags(val);
        } else if (title === 'teams') {
            setFormData({ ...formData, teams: val.length > 0 ? val.map((item: any) => item.id) : [] });
            setSelectedTags(val);
        }
        else {
            setFormData({ ...formData, [title]: val })
        }
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
        navigate('/app/accounts')
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
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            billing_address_line: formData.billing_address_line,
            billing_street: formData.billing_street,
            billing_city: formData.billing_city,
            billing_state: formData.billing_state,
            billing_postcode: formData.billing_postcode,
            billing_country: formData.billing_country,
            previous_residency_address_line: formData.previous_residency_address_line,
            previous_residency_street: formData.previous_residency_street,
            previous_residency_city: formData.previous_residency_city,
            previous_residency_state: formData.previous_residency_state,
            previous_residency_postcode: formData.previous_residency_postcode,
            previous_residency_country: formData.previous_residency_country,
            contact_name: formData.contact_name,
            teams: formData.teams,
            assigned_to: formData.assigned_to,
            tags: formData.tags,
            account_attachment: formData.file,
            website: formData.website,
            status: formData.status,
            lead: formData.lead,
            contacts: formData.contacts,
            date_of_birth: formData.date_of_birth
        }
        fetchData(`${AccountsUrl}/`, 'POST', JSON.stringify(data), Header)
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
            name: '',
            phone: '',
            email: '',
            billing_address_line: '',
            billing_street: '',
            billing_city: '',
            billing_state: '',
            billing_postcode: '',
            billing_country: '',
            previous_residency_address_line: '',
            previous_residency_street: '',
            previous_residency_city: '',
            previous_residency_state: '',
            previous_residency_postcode: '',
            previous_residency_country: '',
            contact_name: '',
            teams: [],
            assigned_to: [],
            tags: [],
            account_attachment: null,
            website: '',
            status: 'open',
            lead: '',
            contacts: [],
            file: null,
            date_of_birth: null,
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

    const module = 'Accounts'
    const crntPage = 'Add Account'
    const backBtn = 'Back To Accounts'

    const handleFileChange = (event:any) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                account_attachment: file.name,
                file: prevData.file,
            }));
    
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    file: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

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
                                    <Typography className='accordion-header'>Account Information</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box sx={{ width: '98%', color: '#1A3353', mb: 1 }}>
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Name</div>
                                                <RequiredTextField
                                                    name='name'
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.name?.[0] ? errors?.name[0] : ''}
                                                    error={!!errors?.name?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Website</div>
                                                <TextField
                                                    name='website'
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.website?.[0] ? errors?.website[0] : ''}
                                                    error={!!errors?.website?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Phone number</div>
                                                <RequiredTextField
                                                    name='phone'
                                                    type='text'
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.phone?.[0] ? errors?.phone[0] : ''}
                                                    error={!!errors?.phone?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Email Address</div>
                                                <RequiredTextField
                                                    name='email'
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.email?.[0] ? errors?.email[0] : ''}
                                                    error={!!errors?.email?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Status</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name='status'
                                                        value={formData.status}
                                                        open={statusSelectOpen}
                                                        onClick={() => setStatusSelectOpen(!statusSelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setStatusSelectOpen(!statusSelectOpen)} className="select-icon-background">
                                                                {statusSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        className='select'
                                                        onChange={handleChange}
                                                        error={!!errors?.status?.[0]}
                                                    >
                                                        {state?.status?.length && state?.status.map((option: any) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors?.status?.[0] ? errors?.status[0] : ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Contact Name</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <RequiredSelect
                                                        name='contact_name'
                                                        value={formData.contact_name}
                                                        open={contactSelectOpen}
                                                        onClick={() => setContactSelectOpen(!contactSelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setContactSelectOpen(!contactSelectOpen)} className="select-icon-background">
                                                                {contactSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        className='select'
                                                        onChange={handleChange}
                                                        error={!!errors?.contact_name?.[0]}
                                                    >
                                                        {state?.contacts?.length && state?.contacts.map((option: any) => (
                                                            <MenuItem key={option?.id} value={option?.first_name}>
                                                                {option?.first_name}
                                                            </MenuItem>
                                                        ))}
                                                    </RequiredSelect>
                                                    <FormHelperText className='helperText'>{errors?.contact_name?.[0] ? errors?.contact_name[0] : ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Lead</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name='lead'
                                                        value={formData.lead}
                                                        open={leadSelectOpen}
                                                        onClick={() => setLeadSelectOpen(!leadSelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setLeadSelectOpen(!leadSelectOpen)} className="select-icon-background">
                                                                {leadSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        className={'select'}
                                                        onChange={handleChange}
                                                        error={!!errors?.lead?.[0]}
                                                    >
                                                        {state?.leads?.length && state?.leads.map((option: any) => (
                                                            <MenuItem key={option?.id} value={option?.id}>
                                                                {option?.title}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText className='helperText'>{errors?.lead?.[0] || ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Teams</div>
                                                <FormControl error={!!errors?.teams?.[0]} sx={{ width: '70%' }}>
                                                    <Autocomplete
                                                        // ref={autocompleteRef}
                                                        value={selectedTeams}
                                                        multiple
                                                        limitTags={5}
                                                        options={state.teams || []}
                                                        // options={state.contacts ? state.contacts.map((option: any) => option) : ['']}
                                                        getOptionLabel={(option: any) => option}
                                                        onChange={(e: any, value: any) => handleChange2('teams', value)}
                                                        size='small'
                                                        filterSelectedOptions
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, index) => (
                                                                <Chip
                                                                    deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                                                    sx={{
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                                        height: '18px'

                                                                    }}
                                                                    variant='outlined'
                                                                    label={option}
                                                                    {...getTagProps({ index })}
                                                                />
                                                            ))
                                                        }
                                                        popupIcon={<CustomPopupIcon ><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                                                        renderInput={(params) => (
                                                            <TextField {...params}
                                                                placeholder='Add Teams'
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    sx: {
                                                                        '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                                                        '& .MuiAutocomplete-endAdornment': {
                                                                            mt: '-8px',
                                                                            mr: '-8px',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <FormHelperText>{errors?.teams?.[0] || ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Assign To</div>
                                                <FormControl error={!!errors?.assigned_to?.[0]} sx={{ width: '70%' }}>
                                                    <Autocomplete
                                                        multiple
                                                        value={selectedAssignTo}
                                                        limitTags={2}
                                                        options={state.users || []}
                                                        getOptionLabel={(option: any) => state.users ? option?.user__email : option}
                                                        onChange={(e: any, value: any) => handleChange2('assigned_to', value)}
                                                        size='small'
                                                        filterSelectedOptions
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, index) => (
                                                                <Chip
                                                                    deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                                                    sx={{
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                                        height: '18px'

                                                                    }}
                                                                    variant='outlined'
                                                                    label={state.users ? option?.user__email : option}
                                                                    {...getTagProps({ index })}
                                                                />
                                                            ))
                                                        }
                                                        popupIcon={<CustomPopupIcon><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                                                        renderInput={(params) => (
                                                            <TextField {...params}
                                                                placeholder='Add Users'
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    sx: {
                                                                        '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                                                        '& .MuiAutocomplete-endAdornment': {
                                                                            mt: '-8px',
                                                                            mr: '-8px',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <FormHelperText>{errors?.assigned_to?.[0] || ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Account Attachment</div>
                                                <TextField
                                                    name='account_attachment'
                                                    value={formData.account_attachment}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton disableFocusRipple
                                                                    disableTouchRipple
                                                                    sx={{ width: '40px', height: '40px', backgroundColor: 'whitesmoke', borderRadius: '0px', mr: '-13px', cursor: 'pointer' }}
                                                                >
                                                                    <label htmlFor='icon-button-file'>
                                                                        <input
                                                                            hidden
                                                                            accept='image/*'
                                                                            id='icon-button-file'
                                                                            type='file'
                                                                            name='account_attachment'
                                                                            onChange={(e: any) => {
                                                                                //  handleChange(e); 
                                                                                handleFileChange(e)
                                                                            }}
                                                                        />
                                                                        <FaUpload color='primary' style={{ fontSize: '15px', cursor: 'pointer' }} />
                                                                    </label>
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    sx={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.account_attachment?.[0] ? errors?.account_attachment[0] : ''}
                                                    error={!!errors?.account_attachment?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Date Of Birth</div>
                                                <RequiredTextField
                                                    type={'date'}
                                                    name='date_of_birth'
                                                    value={formData.date_of_birth}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.date_of_birth?.[0] ? errors?.date_of_birth[0] : ''}
                                                    error={!!errors?.date_of_birth?.[0]}
                                                    sx={{
                                                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                                            backgroundColor: 'whitesmoke',
                                                            padding: '13px',
                                                            marginRight: '-15px'
                                                        }
                                                    }}
                                                ></RequiredTextField>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Tags</div>
                                                <FormControl error={!!errors?.tags?.[0]} sx={{ width: '70%' }}>
                                                    <Autocomplete
                                                        // ref={autocompleteRef}
                                                        value={selectedTags}
                                                        multiple
                                                        limitTags={5}
                                                        options={state.tags || []}
                                                        // options={state.contacts ? state.contacts.map((option: any) => option) : ['']}
                                                        getOptionLabel={(option: any) => option}
                                                        onChange={(e: any, value: any) => handleChange2('tags', value)}
                                                        size='small'
                                                        filterSelectedOptions
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, index) => (
                                                                <Chip
                                                                    deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                                                    sx={{
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                                        height: '18px'

                                                                    }}
                                                                    variant='outlined'
                                                                    label={option}
                                                                    {...getTagProps({ index })}
                                                                />
                                                            ))
                                                        }
                                                        popupIcon={<CustomPopupIcon><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                                                        renderInput={(params) => (
                                                            <TextField {...params}
                                                                placeholder='Add Tags'
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    sx: {
                                                                        '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                                                        '& .MuiAutocomplete-endAdornment': {
                                                                            mt: '-8px',
                                                                            mr: '-8px',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <FormHelperText>{errors?.tags?.[0] || ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
                            <Accordion style={{ width: '98%' }} defaultExpanded>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Address</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component='form'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Billing Address Line</div>
                                                <TextField
                                                    name='billing_address_line'
                                                    value={formData.billing_address_line}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.billing_address_line?.[0] ? errors?.billing_address_line[0] : ''}
                                                    error={!!errors?.billing_address_line?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Billing Street</div>
                                                <TextField
                                                    name='billing_street'
                                                    value={formData.billing_street}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.billing_street?.[0] ? errors?.billing_street[0] : ''}
                                                    error={!!errors?.billing_street?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Billing City</div>
                                                <TextField
                                                    name='billing_city'
                                                    value={formData.billing_city}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.billing_city?.[0] ? errors?.billing_city[0] : ''}
                                                    error={!!errors?.billing_city?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Billing State</div>
                                                <TextField
                                                    name='billing_state'
                                                    value={formData.billing_state}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.billing_state?.[0] ? errors?.billing_state[0] : ''}
                                                    error={!!errors?.billing_state?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Billing Postcode</div>
                                                <TextField
                                                    name='billing_postcode'
                                                    value={formData.billing_postcode}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.billing_postcode?.[0] ? errors?.billing_postcode[0] : ''}
                                                    error={!!errors?.billing_postcode?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Billing Country</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name='billing_country'
                                                        value={formData.billing_country}
                                                        open={countrySelectOpen}
                                                        onClick={() => setCountrySelectOpen(!countrySelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setCountrySelectOpen(!countrySelectOpen)} className="select-icon-background">
                                                                {countrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        className={'select'}
                                                        onChange={handleChange}
                                                        error={!!errors?.billing_country?.[0]}
                                                    >
                                                        {state?.countries?.length && state?.countries.map((option: any) => (
                                                            <MenuItem key={option[0]} value={option[0]}>
                                                                {option[1]}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors?.billing_country?.[0] ? errors?.billing_country[0] : ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
                            <Accordion style={{ width: '98%' }} defaultExpanded>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Previous Address</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component='form'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Previous Address Line</div>
                                                <TextField
                                                    name='previous_residency_address_line'
                                                    value={formData.previous_residency_address_line}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.previous_residency_address_line?.[0] ? errors?.previous_residency_address_line[0] : ''}
                                                    error={!!errors?.previous_residency_address_line?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Previous Street</div>
                                                <TextField
                                                    name='previous_residency_street'
                                                    value={formData.previous_residency_street}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.previous_residency_street?.[0] ? errors?.previous_residency_street[0] : ''}
                                                    error={!!errors?.billing_street?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Previous City</div>
                                                <TextField
                                                    name='previous_residency_city'
                                                    value={formData.previous_residency_city}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.previous_residency_city?.[0] ? errors?.previous_residency_city[0] : ''}
                                                    error={!!errors?.previous_residency_city?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Previous State</div>
                                                <TextField
                                                    name='previous_residency_state'
                                                    value={formData.previous_residency_state}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.previous_residency_state?.[0] ? errors?.previous_residency_state[0] : ''}
                                                    error={!!errors?.previous_residency_state?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Previous Postcode</div>
                                                <TextField
                                                    name='previous_residency_postcode'
                                                    value={formData.previous_residency_postcode}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.previous_residency_postcode?.[0] ? errors?.previous_residency_postcode[0] : ''}
                                                    error={!!errors?.previous_residency_postcode?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Previous Country</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name='previous_residency_country'
                                                        value={formData.previous_residency_country}
                                                        open={countrySelectOpen}
                                                        onClick={() => setCountrySelectOpen(!countrySelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setCountrySelectOpen(!countrySelectOpen)} className="select-icon-background">
                                                                {countrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        className={'select'}
                                                        onChange={handleChange}
                                                        error={!!errors?.previous_residency_country?.[0]}
                                                    >
                                                        {state?.countries?.length && state?.countries.map((option: any) => (
                                                            <MenuItem key={option[0]} value={option[0]}>
                                                                {option[1]}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors?.previous_residency_country?.[0] ? errors?.previous_residency_country[0] : ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div >
                </form >
            </Box >
        </Box >
    )
}
