import React, { useState, useEffect } from 'react';
import axiosInstance from '../apiService';
import { useNavigate } from 'react-router-dom';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';

const EmployeeSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchSalaries = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/employeesalary');
            console.log('API Response:', response);
            
            if (response.data.status === "Success") {
                setSalaries(response.data.data);
            } else {
                toast.error(response.data.message || 'Failed to fetch salary data');
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Error details:', err.response || err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch salary data';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this salary record?')) {
            try {
                const response = await axiosInstance.post('/api/employeesalary/delete', id);
                if (response.data.status === "Success") {
                    toast.success('Salary record deleted successfully');
                    fetchSalaries();
                } else {
                    toast.error(response.data.message || 'Failed to delete salary record');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'Failed to delete salary record';
                toast.error(errorMessage);
            }
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, []);

    if (loading) return <Box p={3}>Loading...</Box>;
    if (error) return <Box p={3} color="error.main">Error: {error}</Box>;

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h1">
                    Employee Salaries
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/salary/create')}
                >
                    Add New Salary Record
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Basic</TableCell>
                            <TableCell>HRA</TableCell>
                            <TableCell>Gross</TableCell>
                            <TableCell>Net Pay</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Effective Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salaries.map((salary) => (
                            <TableRow key={salary.id}>
                                <TableCell>{salary.basic}</TableCell>
                                <TableCell>{salary.hra}</TableCell>
                                <TableCell>{salary.gross}</TableCell>
                                <TableCell>{salary.netPay}</TableCell>
                                <TableCell>{salary.currency}</TableCell>
                                <TableCell>
                                    {new Date(salary.effectiveDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        onClick={() => navigate(`/salary/edit/${salary.id}`)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(salary.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmployeeSalary; 