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
  Tooltip,
  Divider,
  Select,
  Button
} from '@mui/material'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import '../../styles/style.css'
import { LeadUrl } from '../../services/ApiUrls'
import { fetchData, Header } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaArrowDown, FaCheckCircle, FaFileUpload, FaPalette, FaPercent, FaPlus, FaTimes, FaTimesCircle, FaUpload } from 'react-icons/fa'
import { useForm } from '../../components/UseForm'
import { CustomPopupIcon, CustomSelectField, RequiredTextField, StyledSelect } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'

type FormErrors = {
  title?: string[],
  first_name?: string[],
  last_name?: string[],
  account_name?: string[],
  phone?: string[],
  email?: string[],
  lead_attachment?: string[],
  website?: string[],
  description?: string[],
  teams?: string[],
  assigned_to?: string[],
  contacts?: string[],
  status?: string[],
  source?: string[],
  address_line_1?: string[],
  address_line_2?: string[],
  city?: string[],
  enquiry_type?: string[],
  state?: string[],
  postcode?: string[],
  country?: string[],
  tags?: string[],
  company?: string[],
  industry?: string[],
  skype_ID?: string[],
  file?: string[],
};

interface FormData {
  title: string,
  first_name: string,
  last_name: string,
  account_name: string,
  phone: string,
  email: string,
  lead_attachment: string | null,
  website: string,
  description: string,
  teams: string[],
  assigned_to: string[],
  status: string,
  source: string,
  address_line_1: string,
  address_line_2: string,
  enquiry_type: string,
  city: string,
  state: string,
  postcode: string,
  country: string,
  tasks: string[],
  tags: string[],
  company: string,
  industry: string,
  skype_ID: string,
  file: string | null
}

export function AddLeads() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { quill, quillRef } = useQuill();
  const initialContentRef = useRef(null);

  const [error, setError] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState<any[]>([])
  const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [sourceSelectOpen, setSourceSelectOpen] = useState(false)
  const [statusSelectOpen, setStatusSelectOpen] = useState(false)
  const [countrySelectOpen, setCountrySelectOpen] = useState(false)
  const [industrySelectOpen, setIndustrySelectOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    first_name: '',
    last_name: '',
    account_name: '',
    phone: '',
    email: '',
    lead_attachment: '',
    website: '',
    description: '',
    enquiry_type: '',
    teams: [],
    tasks: [],
    assigned_to: [],
    status: '',
    source: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    tags: [],
    company: '',
    industry: '',
    skype_ID: '',
    file: null
  })

  useEffect(() => {
    if (quill) {
      // Save the initial state (HTML content) of the Quill editor
      initialContentRef.current = quillRef.current.firstChild.innerHTML;
    }
  }, [quill]);

  const handleChange2 = (title: any, val: any) => {
    if (title === 'assigned_to') {
      setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] })
      setSelectedAssignTo(val)
    } else if (title === 'tags') {
      setFormData({ ...formData, tags: val.length > 0 ? val.map((item: any) => item.id) : [] })
      setSelectedTags(val)
    } else if (title === 'company') {
      setFormData({ ...formData, company: val.length > 0 ? val.map((item: any) => item.id) : [] })
      setSelectedCompany(val)
    } else {
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
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, file: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetQuillToInitialState = () => {
    // Reset the Quill editor to its initial state
    setFormData({ ...formData, description: '' })
    if (quill && initialContentRef.current !== null) {
      quill.clipboard.dangerouslyPasteHTML(initialContentRef.current);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    submitForm();
  }
  const submitForm = () => {
    // console.log('Form data:', formData.lead_attachment,'sfs', formData.file);
    const data = {
      title: formData.title,
      first_name: formData.first_name,
      last_name: formData.last_name,
      account_name: formData.account_name,
      phone: formData.phone,
      email: formData.email,
      lead_attachment: formData.file,
      website: formData.website,
      description: formData.description,
      enquiry_type: formData.enquiry_type,
      teams: formData.teams,
      tasks: formData.tasks,
      assigned_to: formData.assigned_to,
      status: formData.status,
      source: formData.source,
      address_line_1: formData.address_line_1,
      address_line_2: formData.address_line_2,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
      tags: formData.tags,
      company: formData.company,
      industry: formData.industry,
      skype_ID: formData.skype_ID
    }

    fetchData(`${LeadUrl}/`, 'POST', JSON.stringify(data), Header)
      .then((res: any) => {
        if (!res.error) {
          resetForm()
          navigate('/app/leads')
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
      title: '',
      first_name: '',
      last_name: '',
      account_name: '',
      phone: '',
      email: '',
      lead_attachment: '',
      website: '',
      description: '',
      enquiry_type: '',
      teams: [],
      tasks: [],
      assigned_to: [],
      status: '',
      source: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      tags: [],
      company: '',
      industry: '',
      skype_ID: '',
      file: null
    });
    setErrors({})
    setSelectedAssignTo([])
    setSelectedTags([])
  }
  const onCancel = () => {
    resetForm()
  }

  const backbtnHandle = () => {
    navigate('/app/leads')
  }

  const module = 'Leads'
  const crntPage = 'Add Leads'
  const backBtn = 'Back To Leads'

  // console.log(state, 'leadsform')
  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} onCancel={onCancel} onSubmit={handleSubmit} />
      <Box sx={{ mt: "120px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '10px' }}>
            <div className='leadContainer'>
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Lead Information</Typography>
                </AccordionSummary>
                <Divider className='divider' />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component='form'
                    noValidate
                    autoComplete='off'
                  >
                    <div className='fieldContainer'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Account Name</div>
                        <TextField
                          name='account_name'
                          value={formData.account_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.account_name?.[0] ? errors?.account_name[0] : ''}
                          error={!!errors?.account_name?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                      <div className='fieldTitle'>Assign To</div>
                        <FormControl error={!!errors?.assigned_to?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            multiple
                            value={selectedAssignTo}
                            limitTags={2}
                            options={state?.users || []}
                            getOptionLabel={(option: any) => state?.users ? option?.user__email : option}
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
                                  label={state?.users ? option?.user__email : option}
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
                    </div>
                    <div className='fieldContainer2'>
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
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Industry</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name='industry'
                            value={formData.industry}
                            open={industrySelectOpen}
                            onClick={() => setIndustrySelectOpen(!industrySelectOpen)}
                            IconComponent={() => (
                              <div onClick={() => setIndustrySelectOpen(!industrySelectOpen)} className="select-icon-background">
                                {industrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.industry?.[0]}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px'
                                }
                              }
                            }}
                          >
                            {state?.industries?.length ? state?.industries.map((option: any) => (
                              <MenuItem key={option[0]} value={option[1]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}
                          </Select>
                          <FormHelperText>{errors?.industry?.[0] ? errors?.industry[0] : ''}</FormHelperText>
                        </FormControl>
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
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.status?.[0]}
                          >
                            {state?.status?.length ? state?.status.map((option: any) => (
                              <MenuItem key={option[0]} value={option[1]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}
                          </Select>
                          <FormHelperText>{errors?.status?.[0] ? errors?.status[0] : ''}</FormHelperText>
                        </FormControl>
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>SkypeID</div>
                        <TextField
                          name='skype_ID'
                          value={formData.skype_ID}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.skype_ID?.[0] ? errors?.skype_ID[0] : ''}
                          error={!!errors?.skype_ID?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Lead Source</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name='source'
                            value={formData.source}
                            open={sourceSelectOpen}
                            onClick={() => setSourceSelectOpen(!sourceSelectOpen)}
                            IconComponent={() => (
                              <div onClick={() => setSourceSelectOpen(!sourceSelectOpen)} className="select-icon-background">
                                {sourceSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.source?.[0]}
                          >
                            {state?.source?.length ? state?.source.map((option: any) => (
                              <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}
                          </Select>
                          <FormHelperText>{errors?.source?.[0] ? errors?.source[0] : ''}</FormHelperText>
                        </FormControl>
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Lead Attachment</div>
                        <TextField
                          name='lead_attachment'
                          value={formData.lead_attachment}
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
                          helperText={errors?.lead_attachment?.[0] ? errors?.lead_attachment[0] : ''}
                          error={!!errors?.lead_attachment?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Tags</div>
                        <FormControl error={!!errors?.tags?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            // ref={autocompleteRef}
                            value={selectedTags}
                            multiple
                            limitTags={5}
                            options={state?.tags || []}
                            // options={state.contacts ? state.contacts.map((option: any) => option) : ['']}
                            getOptionLabel={(option: any) => option}
                            onChange={(e: any, value: any) => handleChange2('tags', value)}
                            size='small'
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', height: '18px' }}
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
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Enquiry Type</div>
                        <TextField
                            name='enquiry_type'
                            required
                            value={formData.enquiry_type}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size='small'
                            helperText={errors?.enquiry_type?.[0] ? errors?.enquiry_type[0] : ''}
                            error={!!errors?.enquiry_type?.[0]}
                        />
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* contact details */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Contact</Typography>
                </AccordionSummary>
                <Divider className='divider' />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component='form'
                    noValidate
                    autoComplete='off'
                  >
                    <div className='fieldContainer'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>First Name</div>
                        <RequiredTextField
                          name='first_name'
                          required
                          value={formData.first_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.first_name?.[0] ? errors?.first_name[0] : ''}
                          error={!!errors?.first_name?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Last Name</div>
                        <RequiredTextField
                          name='last_name'
                          required
                          value={formData.last_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.last_name?.[0] ? errors?.last_name[0] : ''}
                          error={!!errors?.last_name?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Job Title</div>
                        <TextField
                          name='title'
                          value={formData.title}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.title?.[0] ? errors?.title[0] : ''}
                          error={!!errors?.title?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Phone Number</div>
                        <Tooltip title="Number must be between 9 and 15 digits">
                          <TextField
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size='small'
                            helperText={errors?.phone?.[0] ? errors?.phone[0] : ''}
                            error={!!errors?.phone?.[0]}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Email Address</div>
                        <TextField
                          name='email'
                          type='email'
                          value={formData.email}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.email?.[0] ? errors?.email[0] : ''}
                          error={!!errors?.email?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Company</div>
                        <FormControl error={!!errors?.company?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            value={selectedCompany}
                            multiple
                            limitTags={1}
                            options={state?.company || []}
                            getOptionLabel={(option: any) => option}
                            onChange={(e: any, value: any) => handleChange2('company', value)}
                            size='small'
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', height: '18px' }}
                                  variant='outlined'
                                  label={option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={<CustomPopupIcon><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                            renderInput={(params) => (
                              <TextField {...params}
                                placeholder='Add Company'
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
            {/* address details */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Address</Typography>
                </AccordionSummary>
                <Divider className='divider' />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component='form'
                    noValidate
                    autoComplete='off'
                  >
                    <div className='fieldContainer'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'
                        >Address Line 1</div>
                        <TextField
                          name='address_line_1'
                          value={formData.address_line_1}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.address_line_1?.[0] ? errors?.address_line_1[0] : ''}
                          error={!!errors?.address_line_1?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>City</div>
                        <TextField
                          name='city'
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.city?.[0] ? errors?.city[0] : ''}
                          error={!!errors?.city?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Address Line 2</div>
                        <TextField
                          name='address_line_2'
                          value={formData.address_line_2}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.address_line_2?.[0] ? errors?.address_line_2[0] : ''}
                          error={!!errors?.address_line_2?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>State</div>
                        <TextField
                          name='state'
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.state?.[0] ? errors?.state[0] : ''}
                          error={!!errors?.state?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Postal Code</div>
                        <TextField
                          name='postcode'
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.postcode?.[0] ? errors?.postcode[0] : ''}
                          error={!!errors?.postcode?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Country</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name='country'
                            value={formData.country}
                            open={countrySelectOpen}
                            onClick={() => setCountrySelectOpen(!countrySelectOpen)}
                            IconComponent={() => (
                              <div onClick={() => setCountrySelectOpen(!countrySelectOpen)} className="select-icon-background">
                                {countrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                              </div>
                            )}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px'
                                }
                              }
                            }}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.country?.[0]}
                          >
                            {state?.countries?.length ? state?.countries.map((option: any) => (
                              <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}

                          </Select>
                          <FormHelperText>{errors?.country?.[0] ? errors?.country[0] : ''}</FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* Description details  */}
            <div className='leadContainer'>
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Description</Typography>
                </AccordionSummary>
                <Divider className='divider' />
                <AccordionDetails>
                  <Box
                    sx={{ width: '100%', mb: 1 }}
                    component='form'
                    noValidate
                    autoComplete='off'
                  >
                    <div className='DescriptionDetail'>
                      <div className='descriptionTitle'>Description</div>
                      <div style={{ width: '100%', marginBottom: '3%' }}>
                        <div ref={quillRef} />
                      </div>
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 1.5 }}>
                      <Button
                        className='header-button'
                        onClick={resetQuillToInitialState}
                        size='small'
                        variant='contained'
                        startIcon={<FaTimesCircle style={{ fill: 'white', width: '16px', marginLeft: '2px' }} />}
                        sx={{ backgroundColor: '#2b5075', ':hover': { backgroundColor: '#1e3750' } }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className='header-button'
                        onClick={() => setFormData({ ...formData, description: quillRef.current.firstChild.innerHTML })}
                        variant='contained'
                        size='small'
                        startIcon={<FaCheckCircle style={{ fill: 'white', width: '16px', marginLeft: '2px' }} />}
                        sx={{ ml: 1 }}
                      >
                        Save
                      </Button>
                    </Box>
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
