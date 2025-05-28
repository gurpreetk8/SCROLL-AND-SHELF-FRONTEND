import React, { useState, useEffect } from 'react';
import { getReports } from '../services/reportService';

const ReportPosts = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await getReports();
      setReports(response);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="report-posts">
      <h2>Reported Content</h2>
      <button onClick={fetchReports}>Refresh Reports</button>

      {reports.length > 0 ? (
        <div className="reports-list">
          {reports.map(report => (
            <div key={report.id} className="report-item">
              <h3>Report ID: {report.id}</h3>
              <p>Reason: {report.reason}</p>
              <p>Description: {report.description || 'No description'}</p>
              {report.post && <p>Post: {report.post.title}</p>}
              {report.comment && <p>Comment: {report.comment.content}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
};

export default ReportPosts;