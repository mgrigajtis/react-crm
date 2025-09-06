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


type CommercialFormErrors = {
    id?: string[],
    account?: string[],
    business_name?: string[],
    business_address_line_1?: string[],
    business_address_line_2?: string[],
    business_city?: string[],
    business_state?: string[],
    business_postal_code?: string[],
    business_mailing_address_line_1?: string[],
    business_mailing_address_line_2?: string[],
    business_mailing_city?: string[],
    business_mailing_state?: string[],
    business_mailing_postal_code?: string[],
    business_website?: string[],
    nature_of_business?: string[],
    business_type?: string[],
    coverage_requested?: string[],
    liability_limit_requested?: string[],
    number_of_owners?: string[],
    number_of_employees?: string[],
    employee_annual_payroll?: string[],
    annual_revenue?: string[],
    years_in_business?: string[],
    years_experience?: string[],
    number_of_contracted_employees?: string[],
    cost_of_contracted_employees?: string[],
    contractors_liability_required?: string[],
    additional_insured?: string[],
    current_insurance_company?: string[],
    effective_date?: string[],
    current_bodily_injury_limits?: string[],
    any_losses?: string[],
    org?: string[]
};

interface CommercialFormData {
    id: string,
    account: string,
    business_name: string,
    business_address_line_1: string,
    business_address_line_2: string,
    business_city: string,
    business_state: string,
    business_postal_code: string,
    business_mailing_address_line_1: string,
    business_mailing_address_line_2: string,
    business_mailing_city: string,
    business_mailing_state: string,
    business_mailing_postal_code: string,
    business_website: string,
    nature_of_business: string,
    business_type: string,
    coverage_requested: string,
    liability_limit_requested: string,
    number_of_owners: string,
    number_of_employees: string,
    employee_annual_payroll: string,
    annual_revenue: string,
    years_in_business: string,
    years_experience: string,
    number_of_contracted_employees: string,
    cost_of_contracted_employees: string,
    contractors_liability_required: boolean,
    additional_insured: string,
    current_insurance_company: string,
    effective_date: string,
    current_bodily_injury_limits: string,
    any_losses: boolean,
    org: string
}

export function EditCommercialForm() {
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


    const [errors, setErrors] = useState<CommercialFormErrors>({});
    const [formData, setFormData] = useState<CommercialFormData>({
        id: '',
        account: '',
        business_name: '',
        business_address_line_1: '',
        business_address_line_2: '',
        business_city: '',
        business_state: '',
        business_postal_code: '',
        business_mailing_address_line_1: '',
        business_mailing_address_line_2: '',
        business_mailing_city: '',
        business_mailing_state: '',
        business_mailing_postal_code: '',
        business_website: '',
        nature_of_business: '',
        business_type: '',
        coverage_requested: '',
        liability_limit_requested: '',
        number_of_owners: '',
        number_of_employees: '',
        employee_annual_payroll: '',
        annual_revenue: '',
        years_in_business: '',
        years_experience: '',
        number_of_contracted_employees: '',
        cost_of_contracted_employees: '',
        contractors_liability_required: false,
        additional_insured: '',
        current_insurance_company: '',
        effective_date: '',
        current_bodily_injury_limits: '',
        any_losses: false,
        org: ''
    })

    useEffect(() => {
        setFormData(state?.value)
    }, [state?.id])

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
            business_name: formData.business_name,
            business_address_line_1: formData.business_address_line_1,
            business_address_line_2: formData.business_address_line_2,
            business_city: formData.business_city,
            business_state: formData.business_state,
            business_postal_code: formData.business_postal_code,
            business_mailing_address_line_1: formData.business_mailing_address_line_1,
            business_mailing_address_line_2: formData.business_mailing_address_line_2,
            business_mailing_city: formData.business_mailing_city,
            business_mailing_state: formData.business_mailing_state,
            business_mailing_postal_code: formData.business_mailing_postal_code,
            business_website: formData.business_website,
            nature_of_business: formData.nature_of_business,
            business_type: formData.business_type,
            coverage_requested: formData.coverage_requested,
            liability_limit_requested: formData.liability_limit_requested,
            number_of_owners: formData.number_of_owners,
            number_of_employees: formData.number_of_employees,
            employee_annual_payroll: formData.employee_annual_payroll,
            annual_revenue: formData.annual_revenue,
            years_in_business: formData.years_in_business,
            years_experience: formData.years_experience,
            number_of_contracted_employees: formData.number_of_contracted_employees,
            cost_of_contracted_employees: formData.cost_of_contracted_employees,
            contractors_liability_required: formData.contractors_liability_required,
            additional_insured: formData.additional_insured,
            current_insurance_company: formData.current_insurance_company,
            effective_date: formData.effective_date,
            current_bodily_injury_limits: formData.current_bodily_injury_limits,
            any_losses: formData.any_losses,
            org: formData.org
        }

        fetchData(`${AccountsUrl}/commercial-form/${formData.id}/`, 'PUT', JSON.stringify(data), Header)
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
            account: '',
            business_name: '',
            business_address_line_1: '',
            business_address_line_2: '',
            business_city: '',
            business_state: '',
            business_postal_code: '',
            business_mailing_address_line_1: '',
            business_mailing_address_line_2: '',
            business_mailing_city: '',
            business_mailing_state: '',
            business_mailing_postal_code: '',
            business_website: '',
            nature_of_business: '',
            business_type: '',
            coverage_requested: '',
            liability_limit_requested: '',
            number_of_owners: '',
            number_of_employees: '',
            employee_annual_payroll: '',
            annual_revenue: '',
            years_in_business: '',
            years_experience: '',
            number_of_contracted_employees: '',
            cost_of_contracted_employees: '',
            contractors_liability_required: false,
            additional_insured: '',
            current_insurance_company: '',
            effective_date: '',
            current_bodily_injury_limits: '',
            any_losses: false,
            org: ''
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
                                            <div className='fieldTitle'>Business Name</div>
                                            <FormControl error={!!errors?.business_name?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_name'
                                                    value={formData.business_name}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_name?.[0] ? errors?.business_name[0] : ''}
                                                    error={!!errors?.business_name?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Effective Date</div>
                                            <FormControl error={!!errors?.effective_date?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'date'}
                                                    name='effective_date'
                                                    value={formData.effective_date}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.effective_date?.[0] ? errors?.effective_date[0] : ''}
                                                    error={!!errors?.effective_date?.[0]}
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
                                            <div className='fieldTitle'>Business Address Line 1</div>
                                            <FormControl error={!!errors?.business_address_line_1?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_address_line_1'
                                                    value={formData.business_address_line_1}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_address_line_1?.[0] ? errors?.business_address_line_1[0] : ''}
                                                    error={!!errors?.business_address_line_1?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Address Line 2</div>
                                            <FormControl error={!!errors?.business_address_line_2?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_address_line_2'
                                                    value={formData.business_address_line_2}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_address_line_2?.[0] ? errors?.business_address_line_2[0] : ''}
                                                    error={!!errors?.business_address_line_2?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business City</div>
                                            <FormControl error={!!errors?.business_city?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_city'
                                                    value={formData.business_city}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_city?.[0] ? errors?.business_city[0] : ''}
                                                    error={!!errors?.business_city?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business State</div>
                                            <FormControl error={!!errors?.business_state?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_state'
                                                    value={formData.business_state}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_state?.[0] ? errors?.business_state[0] : ''}
                                                    error={!!errors?.business_state?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Postal Code</div>
                                            <FormControl error={!!errors?.business_postal_code?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_postal_code'
                                                    value={formData.business_postal_code}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_postal_code?.[0] ? errors?.business_postal_code[0] : ''}
                                                    error={!!errors?.business_postal_code?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Mailing Address Line 1</div>
                                            <FormControl error={!!errors?.business_mailing_address_line_1?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_mailing_address_line_1'
                                                    value={formData.business_mailing_address_line_1}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_mailing_address_line_1?.[0] ? errors?.business_mailing_address_line_1[0] : ''}
                                                    error={!!errors?.business_mailing_address_line_1?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Mailing Address Line 2</div>
                                            <FormControl error={!!errors?.business_mailing_address_line_2?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_mailing_address_line_2'
                                                    value={formData.business_mailing_address_line_2}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_mailing_address_line_2?.[0] ? errors?.business_mailing_address_line_2[0] : ''}
                                                    error={!!errors?.business_mailing_address_line_2?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Mailing City</div>
                                            <FormControl error={!!errors?.business_mailing_city?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_mailing_city'
                                                    value={formData.business_mailing_city}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_mailing_city?.[0] ? errors?.business_mailing_city[0] : ''}
                                                    error={!!errors?.business_mailing_city?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Mailing State</div>
                                            <FormControl error={!!errors?.business_mailing_state?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_mailing_state'
                                                    value={formData.business_mailing_state}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_mailing_state?.[0] ? errors?.business_mailing_state[0] : ''}
                                                    error={!!errors?.business_mailing_state?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Mailing Postal Code</div>
                                            <FormControl error={!!errors?.business_mailing_postal_code?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_mailing_postal_code'
                                                    value={formData.business_mailing_postal_code}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_mailing_postal_code?.[0] ? errors?.business_mailing_postal_code[0] : ''}
                                                    error={!!errors?.business_mailing_postal_code?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Website</div>
                                            <FormControl error={!!errors?.business_website?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_website'
                                                    value={formData.business_website}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_website?.[0] ? errors?.business_website[0] : ''}
                                                    error={!!errors?.business_website?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Nature of Business</div>
                                            <FormControl error={!!errors?.nature_of_business?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='nature_of_business'
                                                    value={formData.nature_of_business}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.nature_of_business?.[0] ? errors?.nature_of_business[0] : ''}
                                                    error={!!errors?.nature_of_business?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Business Type</div>
                                            <FormControl error={!!errors?.business_type?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='business_type'
                                                    value={formData.business_type}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.business_type?.[0] ? errors?.business_type[0] : ''}
                                                    error={!!errors?.business_type?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Coverage Requested</div>
                                            <FormControl error={!!errors?.coverage_requested?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='coverage_requested'
                                                    value={formData.coverage_requested}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.coverage_requested?.[0] ? errors?.coverage_requested[0] : ''}
                                                    error={!!errors?.coverage_requested?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Liability Limit Requested</div>
                                            <FormControl error={!!errors?.liability_limit_requested?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='liability_limit_requested'
                                                    value={formData.liability_limit_requested}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.liability_limit_requested?.[0] ? errors?.liability_limit_requested[0] : ''}
                                                    error={!!errors?.liability_limit_requested?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Number of Owners</div>
                                            <FormControl error={!!errors?.number_of_owners?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='number_of_owners'
                                                    value={formData.number_of_owners}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.number_of_owners?.[0] ? errors?.number_of_owners[0] : ''}
                                                    error={!!errors?.number_of_owners?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Number of Employees</div>
                                            <FormControl error={!!errors?.number_of_employees?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='number_of_employees'
                                                    value={formData.number_of_employees}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.number_of_employees?.[0] ? errors?.number_of_employees[0] : ''}
                                                    error={!!errors?.number_of_employees?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Employee Annual Payroll</div>
                                            <FormControl error={!!errors?.employee_annual_payroll?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='employee_annual_payroll'
                                                    value={formData.employee_annual_payroll}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.employee_annual_payroll?.[0] ? errors?.employee_annual_payroll[0] : ''}
                                                    error={!!errors?.employee_annual_payroll?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Annual Revenue</div>
                                            <FormControl error={!!errors?.annual_revenue?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='annual_revenue'
                                                    value={formData.annual_revenue}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.annual_revenue?.[0] ? errors?.annual_revenue[0] : ''}
                                                    error={!!errors?.annual_revenue?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Years in Business</div>
                                            <FormControl error={!!errors?.years_in_business?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='years_in_business'
                                                    value={formData.years_in_business}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.years_in_business?.[0] ? errors?.years_in_business[0] : ''}
                                                    error={!!errors?.years_in_business?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Years of Experience</div>
                                            <FormControl error={!!errors?.years_experience?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='years_experience'
                                                    value={formData.years_experience}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.years_experience?.[0] ? errors?.years_experience[0] : ''}
                                                    error={!!errors?.years_experience?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Number of Contracted Employees</div>
                                            <FormControl error={!!errors?.number_of_contracted_employees?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='number_of_contracted_employees'
                                                    value={formData.number_of_contracted_employees}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.number_of_contracted_employees?.[0] ? errors?.number_of_contracted_employees[0] : ''}
                                                    error={!!errors?.number_of_contracted_employees?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Cost of Contracted Employees</div>
                                            <FormControl error={!!errors?.cost_of_contracted_employees?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'number'}
                                                    name='cost_of_contracted_employees'
                                                    value={formData.cost_of_contracted_employees}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.cost_of_contracted_employees?.[0] ? errors?.cost_of_contracted_employees[0] : ''}
                                                    error={!!errors?.cost_of_contracted_employees?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Contractors Liability Required</div>
                                            <FormControl error={!!errors?.contractors_liability_required?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='contractors_liability_required'
                                                    checked={formData.contractors_liability_required}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, contractors_liability_required: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Additional Insured</div>
                                            <FormControl error={!!errors?.additional_insured?.[0]} sx={{ width: '70%' }}>
                                            <TextField
                                                    type={'text'}
                                                    name='additional_insured'
                                                    value={formData.additional_insured}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.additional_insured?.[0] ? errors?.additional_insured[0] : ''}
                                                    error={!!errors?.additional_insured?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Current Insurance Company</div>
                                            <FormControl error={!!errors?.current_insurance_company?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='current_insurance_company'
                                                    value={formData.current_insurance_company}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.current_insurance_company?.[0] ? errors?.current_insurance_company[0] : ''}
                                                    error={!!errors?.current_insurance_company?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Any Losses</div>
                                            <FormControl error={!!errors?.any_losses?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='any_losses'
                                                    checked={formData.any_losses}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, any_losses: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Current Bodily Injury Limits</div>
                                            <FormControl error={!!errors?.current_bodily_injury_limits?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='current_bodily_injury_limits'
                                                    value={formData.current_bodily_injury_limits}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.current_bodily_injury_limits?.[0] ? errors?.current_bodily_injury_limits[0] : ''}
                                                    error={!!errors?.current_bodily_injury_limits?.[0]}
                                                />
                                            </FormControl>
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
