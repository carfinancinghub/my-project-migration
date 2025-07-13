// Date: 062625 [1000], © 2025 CFH
require('module-alias/register');
import express from 'express';
import userProfileRoutes from '@routes/user/userProfileRoutes';
import paymentRoutes from '@routes/payments/payments';
import reportRoutes from '@routes/reports/reports';
const app = express();
app.use(express.json());
app.use('/user', userProfileRoutes);
app.use('/payments', paymentRoutes);
app.use('/reports', reportRoutes);
app.listen(3000, () => console.log('Server running on port 3000'));
