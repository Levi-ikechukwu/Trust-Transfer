import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, User, Mail, DollarSign, CheckCircle, ShieldCheck } from 'lucide-react';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Get your Paystack Public Key from your environment variables
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: amount ? parseInt(amount, 10) * 100 : 0, // Paystack expects amount in kobo/pesewas
    publicKey: publicKey,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    console.log('Payment complete! Reference: ', reference);
    setIsSuccess(true);
  };

  const onClose = () => {
    console.log('Payment closed.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !amount) {
      alert("Please fill in all fields");
      return;
    }
    initializePayment(onSuccess, onClose);
  };

  if (isSuccess) {
    return (
      <div className="payment-container">
        <div className="payment-card success-card">
          <div className="success-icon-wrapper">
            <CheckCircle />
          </div>
          <h2 className="card-title">Payment Successful!</h2>
          <p className="card-subtitle">Thank you, {name}. Your payment of NGN {amount} has been received securely.</p>
          <button className="reset-button" onClick={() => {
            setIsSuccess(false);
            setName('');
            setEmail('');
            setAmount('');
          }}>
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="card-header">
          <div className="icon-wrapper">
            <CreditCard />
          </div>
          <h2 className="card-title">Make a Payment</h2>
          <p className="card-subtitle">Enter your details below to securely transfer funds.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input 
                type="email" 
                className="form-input" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Amount (NGN)</label>
            <div className="input-wrapper amount-input-wrapper">
              <DollarSign className="input-icon" />
              <input 
                type="number" 
                className="form-input" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                required
              />
            </div>
          </div>

          <button type="submit" className="pay-button">
            Pay NGN {amount || '0'} Securely <ShieldCheck size={20} />
          </button>
        </form>

        <div className="footer">
          <div className="secure-badge">
            <ShieldCheck size={14} /> Secured by Paystack
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
