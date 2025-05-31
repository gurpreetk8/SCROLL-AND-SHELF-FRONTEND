import React from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestBookLanding = () => {
  return (
    <div style={{
      position: 'relative',
      padding: '96px 0',
      backgroundColor: 'white',
      overflow: 'hidden',
      minHeight: '100vh'
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '-128px',
          left: '-128px',
          width: '256px',
          height: '256px',
          borderRadius: '50%',
          backgroundColor: 'rgba(191, 219, 254, 0.3)',
          filter: 'blur(48px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-128px',
          right: '-128px',
          width: '256px',
          height: '256px',
          borderRadius: '50%',
          backgroundColor: 'rgba(253, 230, 138, 0.3)',
          filter: 'blur(48px)'
        }} />
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        zIndex: 1
      }}>
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginBottom: '64px',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '36px',
            fontWeight: 300,
            color: '#111827',
            lineHeight: 1.2
          }}>
            Request a <span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Book</span>
          </h2>
          <p style={{
            marginTop: '16px',
            color: '#4b5563',
            maxWidth: '672px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '18px'
          }}>
            Looking for a specific book or genre? Let us know and we'll do our best to bring it to you.
          </p>
          <div style={{
            width: '96px',
            height: '1px',
            margin: '16px auto 0',
            background: 'linear-gradient(to right, transparent, #d1d5db, transparent)'
          }} />
        </motion.div>

        {/* Card container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          style={{
            maxWidth: '512px',
            margin: '0 auto',
            backgroundColor: 'white',
            border: '1px solid #f3f4f6',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '64px',
            background: 'linear-gradient(to bottom, #eff6ff, #fef3c7)'
          }}>
            {/* Book icon */}
            <div style={{
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              marginBottom: '16px'
            }}>
              <Book style={{
                height: '24px',
                width: '24px',
                color: '#2563eb'
              }} />
            </div>

            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '8px'
            }}>
              Custom Requests
            </h3>
            <p style={{
              color: '#4b5563',
              maxWidth: '320px',
              marginBottom: '32px'
            }}>
              Tell us what you're looking for and we'll try our best to add it.
            </p>

            {/* Working button with Link */}
            <Link 
              to="/request-book" 
              style={{
                display: 'block',
                width: '100%',
                textDecoration: 'none'
              }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: '#1f2937'
                }}
                whileTap={{ 
                  scale: 0.98,
                  backgroundColor: '#111827'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#111827',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Continue to Request Form</span>
                <ChevronRight style={{
                  height: '20px',
                  width: '20px'
                }} />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestBookLanding;