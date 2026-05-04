import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Building2, User, Mail, DollarSign, CheckCircle, Lock, ShieldCheck } from 'lucide-react';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [reference, setReference] = useState('');

  // Get your Flutterwave Public Key from your environment variables
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-your-public-key-here';

  const config = {
    public_key: publicKey,
    tx_ref: Date.now().toString(),
    amount: amount ? parseFloat(amount) : 0,
    currency: 'USD',
    payment_options: 'card',
    customer: {
      email: email,
      name: name,
    },
    customizations: {
      title: 'Trust Transfer',
      description: 'Secure Banking Transfer',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !amount) {
      alert("Please fill in all fields");
      return;
    }
    
    handleFlutterPayment({
      callback: (response) => {
         console.log(response);
         if (response.status === 'successful') {
           setReference(response.transaction_id || response.tx_ref);
           setIsSuccess(true);
         }
         closePaymentModal();
      },
      onClose: () => {
        console.log('Payment closed.');
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="payment-container">
        <div className="brand-header">
          <div className="brand-icon">
            <Building2 color="#ffffff" size={24} />
          </div>
          <span className="brand-title">TRUST TRANSFER</span>
        </div>

        <div className="payment-card success-card">
          <div className="success-icon-wrapper">
            <CheckCircle />
          </div>
          <h2 className="card-title">Transfer Successful</h2>
          <p className="card-subtitle">Your funds have been securely transferred.</p>
          
          <div className="receipt-details">
            <div className="receipt-row">
              <span className="receipt-label">Beneficiary</span>
              <span className="receipt-value">{name}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Reference</span>
              <span className="receipt-value">#{reference || config.tx_ref}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount Transferred</span>
              <span className="receipt-value">USD ${parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>

          <button className="reset-button" onClick={() => {
            setIsSuccess(false);
            setName('');
            setEmail('');
            setAmount('');
            setReference('');
          }}>
            Initiate New Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="brand-header">
        <div className="brand-icon">
          <Building2 color="#ffffff" size={24} />
        </div>
        <span className="brand-title">TRUST TRANSFER</span>
      </div>

      <div className="payment-card">
        <div className="card-header">
          <h2 className="card-title">Initiate Transfer</h2>
          <p className="card-subtitle">Enter transfer details below to securely process the transaction.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Account Holder Name</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Contact Email</label>
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
            <label className="input-label">Transfer Amount (USD)</label>
            <div className="input-wrapper amount-input-wrapper">
              <DollarSign className="input-icon" />
              <input 
                type="number" 
                className="form-input" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <button type="submit" className="pay-button">
            Transfer USD ${amount ? parseFloat(amount).toFixed(2) : '0.00'}
          </button>
        </form>

        <div className="footer">
          <div className="secure-messaging">
            <Lock size={16} />
            <span>256-bit Bank-Grade Encryption</span>
          </div>
          <div className="powered-by">
            <ShieldCheck size={14} /> Secured by Flutterwave
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
