import React, { useState, useEffect } from 'react';
import axiosInstance from '../apiService';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    MenuItem,
    Paper,
    Alert,
    Snackbar
} from '@mui/material';
import { toast } from 'react-toastify';

const EmployeeSalaryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        basic: 0,
        hra: 0,
        workAllowance: 0,
        statutoryBonus: 0,
        gross: 0,
        employeePF: 0,
        employeeESIC: 0,
        companyContribution: 0,
        insurance: 0,
        ctc: 0,
        employerPF: 0,
        employerESI: 0,
        lwf: 0,
        pt: 0,
        totalDeduction: 0,
        netPay: 0,
        paymentFrequency: 'Monthly',
        currency: 'INR',
        effectiveDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (id) {
            fetchSalaryData();
        }
    }, [id]);

    const fetchSalaryData = async () => {
        try {
            const response = await axiosInstance.get(`/api/employeesalary?id=${id}`);
            if (response.data.status === "Success") {
                setFormData(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching salary data');
        }
    };

    const validateForm = () => {
        const requiredFields = [
            'basic', 'hra', 'workAllowance', 'statutoryBonus', 
            'employeePF', 'employeeESIC', 'companyContribution', 
            'insurance', 'ctc', 'employerPF', 'employerESI', 
            'lwf', 'pt', 'paymentFrequency', 'currency', 'effectiveDate'
        ];

        for (const field of requiredFields) {
            if (!formData[field] && formData[field] !== 0) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const endpoint = id ? '/api/employeesalary/update' : '/api/employeesalary/create';
            
            // Convert all numeric values to proper decimal format
            const dataToSubmit = {
                ...formData,
                basic: parseFloat(formData.basic),
                hra: parseFloat(formData.hra),
                workAllowance: parseFloat(formData.workAllowance),
                statutoryBonus: parseFloat(formData.statutoryBonus),
                gross: parseFloat(formData.gross),
                employeePF: parseFloat(formData.employeePF),
                employeeESIC: parseFloat(formData.employeeESIC),
                companyContribution: parseFloat(formData.companyContribution),
                insurance: parseFloat(formData.insurance),
                ctc: parseFloat(formData.ctc),
                employerPF: parseFloat(formData.employerPF),
                employerESI: parseFloat(formData.employerESI),
                lwf: parseFloat(formData.lwf),
                pt: parseFloat(formData.pt),
                totalDeduction: parseFloat(formData.totalDeduction),
                netPay: parseFloat(formData.netPay),
                effectiveDate: new Date(formData.effectiveDate).toISOString(),
                id: id ? parseInt(id) : undefined
            };
            
            console.log('Submitting data:', dataToSubmit);
            const response = await axiosInstance.post(endpoint, dataToSubmit);
            
            if (response.data.status === "Success") {
                toast.success(`Salary record ${id ? 'updated' : 'created'} successfully`);
                setTimeout(() => {
                    navigate('/salaries');
                }, 1500);
            } else {
                toast.error(response.data.message || 'Operation failed');
            }
        } catch (err) {
            console.error('Error details:', err.response || err);
            const errorMessage = err.response?.data?.message || err.message || 'Operation failed';
            toast.error(errorMessage);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotals = () => {
        // Calculate gross
        const gross = Number(formData.basic) + Number(formData.hra) + 
                     Number(formData.workAllowance) + Number(formData.statutoryBonus);
        
        // Calculate total deductions
        const totalDeduction = Number(formData.employeePF) + Number(formData.employeeESIC) + 
                             Number(formData.pt) + Number(formData.lwf);
        
        // Calculate net pay
        const netPay = gross - totalDeduction;

        setFormData(prev => ({
            ...prev,
            gross,
            totalDeduction,
            netPay
        }));
    };

    useEffect(() => {
        calculateTotals();
    }, [formData.basic, formData.hra, formData.workAllowance, formData.statutoryBonus,
        formData.employeePF, formData.employeeESIC, formData.pt, formData.lwf]);

    return (
        <Box p={3}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    {id ? 'Edit Salary Record' : 'Create New Salary Record'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Basic Salary Information */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Basic Salary"
                                name="basic"
                                type="number"
                                value={formData.basic}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="HRA"
                                name="hra"
                                type="number"
                                value={formData.hra}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Work Allowance"
                                name="workAllowance"
                                type="number"
                                value={formData.workAllowance}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Statutory Bonus"
                                name="statutoryBonus"
                                type="number"
                                value={formData.statutoryBonus}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Employee Contributions */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Employee PF"
                                name="employeePF"
                                type="number"
                                value={formData.employeePF}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Employee ESIC"
                                name="employeeESIC"
                                type="number"
                                value={formData.employeeESIC}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Employer Contributions */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Employer PF"
                                name="employerPF"
                                type="number"
                                value={formData.employerPF}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Employer ESI"
                                name="employerESI"
                                type="number"
                                value={formData.employerESI}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Other Details */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="LWF"
                                name="lwf"
                                type="number"
                                value={formData.lwf}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Professional Tax"
                                name="pt"
                                type="number"
                                value={formData.pt}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Calculated Fields (Read Only) */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Gross Salary"
                                value={formData.gross}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Total Deductions"
                                value={formData.totalDeduction}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Net Pay"
                                value={formData.netPay}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        {/* Additional Fields */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Payment Frequency"
                                name="paymentFrequency"
                                value={formData.paymentFrequency}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="INR">INR</MenuItem>
                                <MenuItem value="USD">USD</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Effective Date"
                                name="effectiveDate"
                                value={formData.effectiveDate}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/salaries')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {id ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmployeeSalaryForm; 