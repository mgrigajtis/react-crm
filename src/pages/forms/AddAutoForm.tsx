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


type AutoFormErrors = {
    account?: string[],
    VIN?: string[],
    model_year?: string[],
    make?: string[],
    model?: string[],
    liability_coverage?: string[],
    collision_coverage?: string[],
    comprehensive_coverage?: string[],
    personal_injury_protection_pip?: string[],
    medical_payments?: string[],
    uninsured_underinsured_motorist_coverage?: string[],
    rental_reimbursement_coverage?: string[],
    roadside_assistance?: string[],
    gap_insurance?: string[],
    custom_parts_and_equipment_coverage?: string[],
    accident_forgiveness?: string[],
    new_car_replacement?: string[],
    loss_of_use?: string[],
    org?: string[]
};

interface AutoFormData {
    account: string,
    VIN: string,
    model_year: string,
    make: string,
    model: string,
    liability_coverage: boolean,
    collision_coverage: boolean,
    comprehensive_coverage: boolean,
    personal_injury_protection_pip: boolean,
    medical_payments: boolean,
    uninsured_underinsured_motorist_coverage: boolean,
    rental_reimbursement_coverage: boolean,
    roadside_assistance: boolean,
    gap_insurance: boolean,
    custom_parts_and_equipment_coverage: boolean,
    accident_forgiveness: boolean,
    new_car_replacement: boolean,
    loss_of_use: boolean,
    org: string
}

export function AddAutoForm() {
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

    
    const [errors, setErrors] = useState<AutoFormErrors>({});
    const [formData, setFormData] = useState<AutoFormData>({
        account: '',
        VIN: '',
        model_year: '',
        make: '',
        model: '',
        liability_coverage: false,
        collision_coverage: false,
        comprehensive_coverage: false,
        personal_injury_protection_pip: false,
        medical_payments: false,
        uninsured_underinsured_motorist_coverage: false,
        rental_reimbursement_coverage: false,
        roadside_assistance: false,
        gap_insurance: false,
        custom_parts_and_equipment_coverage: false,
        accident_forgiveness: false,
        new_car_replacement: false,
        loss_of_use: false,
        org: ''
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
        navigate('/app/accounts/account-details', { state: { accountId: state?.account.id, detail: true, contacts: state?.contacts || [], status: state?.status || [], tags: state?.tags || [], users: state?.users || [], countries: state?.countries || [], teams: state?.teams || [], leads: state?.leads || [] }})
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
            auto_intake: {
                VIN: formData.VIN,
                model_year: formData.model_year,
                make: formData.make,
                model: formData.model,
                liability_coverage: formData.liability_coverage,
                collision_coverage: formData.collision_coverage,
                comprehensive_coverage: formData.comprehensive_coverage,
                personal_injury_protection_pip: formData.personal_injury_protection_pip,
                medical_payments: formData.medical_payments,
                uninsured_underinsured_motorist_coverage: formData.uninsured_underinsured_motorist_coverage,
                rental_reimbursement_coverage: formData.rental_reimbursement_coverage,
                roadside_assistance: formData.roadside_assistance,
                gap_insurance: formData.gap_insurance,
                custom_parts_and_equipment_coverage: formData.custom_parts_and_equipment_coverage,
                accident_forgiveness: formData.accident_forgiveness,
                new_car_replacement: formData.new_car_replacement,
                loss_of_use: formData.loss_of_use,
                org: formData.org
            }
        }
        console.log(data)
        fetchData(`${AccountsUrl}/auto-intake/`, 'POST', JSON.stringify(data), Header)
            .then((res: any) => {
                // console.log('Form data:', res);
                if (!res.error) {
                    resetForm()
                    console.log(state)
                    navigate('/app/accounts/account-details', { state: { accountId: state?.account.id, detail: true, contacts: state?.contacts || [], status: state?.status || [], tags: state?.tags || [], users: state?.users || [], countries: state?.countries || [], teams: state?.teams || [], leads: state?.leads || [] }})
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
            account: '',
            VIN: '',
            model_year: '',
            make: '',
            model: '',
            liability_coverage: false,
            collision_coverage: false,
            comprehensive_coverage: false,
            personal_injury_protection_pip: false,
            medical_payments: false,
            uninsured_underinsured_motorist_coverage: false,
            rental_reimbursement_coverage: false,
            roadside_assistance: false,
            gap_insurance: false,
            custom_parts_and_equipment_coverage: false,
            accident_forgiveness: false,
            new_car_replacement: false,
            loss_of_use: false,
            org: ''
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
                                            <div className='fieldTitle'>VIN</div>
                                            <FormControl error={!!errors?.VIN?.[0]} sx={{ width: '70%' }}>
                                            <TextField
                                                    type={'text'}
                                                    name='VIN'
                                                    value={formData.VIN}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.VIN?.[0] ? errors?.VIN[0] : ''}
                                                    error={!!errors?.VIN?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Model Year</div>
                                            <FormControl error={!!errors?.model_year?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='model_year'
                                                    value={formData.model_year}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.model_year?.[0] ? errors?.model_year[0] : ''}
                                                    error={!!errors?.model_year?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Make</div>
                                            <FormControl error={!!errors?.make?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='make'
                                                    value={formData.make}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.make?.[0] ? errors?.make[0] : ''}
                                                    error={!!errors?.make?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Model</div>
                                            <FormControl error={!!errors?.model?.[0]} sx={{ width: '70%' }}>
                                                <TextField
                                                    type={'text'}
                                                    name='model'
                                                    value={formData.model}
                                                    onChange={handleChange}
                                                    size='small'
                                                    helperText={errors?.model?.[0] ? errors?.model[0] : ''}
                                                    error={!!errors?.model?.[0]}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>  
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Liability Coverag</div>
                                            <FormControl error={!!errors?.liability_coverage?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='liability_coverage'
                                                    checked={formData.liability_coverage}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, liability_coverage: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Collision Coverage</div>
                                            <FormControl error={!!errors?.collision_coverage?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='collision_coverage'
                                                    checked={formData.collision_coverage}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, collision_coverage: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Comprehensive Coverage</div>
                                            <FormControl error={!!errors?.comprehensive_coverage?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='comprehensive_coverage'
                                                    checked={formData.comprehensive_coverage}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, comprehensive_coverage: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Collision Coverage</div>
                                            <FormControl error={!!errors?.personal_injury_protection_pip?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='personal_injury_protection_pip'
                                                    checked={formData.personal_injury_protection_pip}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, personal_injury_protection_pip: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>

                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Medical Payments</div>
                                            <FormControl error={!!errors?.liability_coverage?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='medical_payments'
                                                    checked={formData.medical_payments}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, medical_payments: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Uninsured Motorist Coverage</div>
                                            <FormControl error={!!errors?.uninsured_underinsured_motorist_coverage?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='uninsured_underinsured_motorist_coverage'
                                                    checked={formData.uninsured_underinsured_motorist_coverage}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, uninsured_underinsured_motorist_coverage: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Rental Reimbursement Coverage</div>
                                            <FormControl error={!!errors?.rental_reimbursement_coverage?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='rental_reimbursement_coverage'
                                                    checked={formData.rental_reimbursement_coverage}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, rental_reimbursement_coverage: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Roadside Assistance</div>
                                            <FormControl error={!!errors?.roadside_assistance?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='roadside_assistance'
                                                    checked={formData.roadside_assistance}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, roadside_assistance: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Gap Insurance</div>
                                            <FormControl error={!!errors?.gap_insurance?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='gap_insurance'
                                                    checked={formData.gap_insurance}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, gap_insurance: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Custom Parts and Equipment Coverage</div>
                                            <FormControl error={!!errors?.custom_parts_and_equipment_coverage?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='custom_parts_and_equipment_coverage'
                                                    checked={formData.custom_parts_and_equipment_coverage}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, custom_parts_and_equipment_coverage: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Accident Forgiveness</div>
                                            <FormControl error={!!errors?.accident_forgiveness?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='accident_forgiveness'
                                                    checked={formData.accident_forgiveness}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, accident_forgiveness: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>New Car Replacement</div>
                                            <FormControl error={!!errors?.new_car_replacement?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='new_car_replacement'
                                                    checked={formData.new_car_replacement}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, new_car_replacement: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='fieldContainer2'>
                                        <div className='fieldSubContainer'>
                                            <div className='fieldTitle'>Loss of Use</div>
                                            <FormControl error={!!errors?.loss_of_use?.[0]} sx={{ width: '70%' }}>
                                                <AntSwitch
                                                    name='loss_of_use'
                                                    checked={formData.loss_of_use}
                                                    onChange={(e: any) => { setFormData((prevData) => ({ ...prevData, loss_of_use: e.target.checked })) }}
                                                    sx={{ mt: '1%' }}
                                                />
                                            </FormControl>
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
