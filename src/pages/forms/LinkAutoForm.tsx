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


type FormErrors = {
    account_id?: string[],
    auto_intake_id?: string[],
};

interface FormData {
    account_id: string,
    auto_intake_id: string,
}

export function LinkAutoForm() {
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

    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        account_id: state?.account.id,
        auto_intake_id: '',
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
            account_id: formData.account_id,
            auto_intake_id: formData.auto_intake_id,
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
            account_id: state?.account.id,
            auto_intake_id: '',
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
                                <Typography className='accordion-header'>Link Auto Intake Form</Typography>
                            </AccordionSummary>
                            <Divider className='divider' />
                            <AccordionDetails>
                                
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </form>
        </Box>
    </Box >
    )
}
