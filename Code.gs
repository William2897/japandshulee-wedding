/**
 * Google Apps Script for Wedding RSVP Form - CORS FIXED VERSION
 * This script receives RSVP form submissions and stores them in Google Sheets
 * 
 * Setup Instructions:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Replace the default code with this code
 * 3. Create a new Google Sheets document for storing RSVPs
 * 4. Copy the Google Sheets ID from the URL and replace 'YOUR_SHEET_ID_HERE' below
 * 5. Deploy the script as a web app with execute permissions set to "Anyone"
 * 6. Copy the deployment URL and update the scriptURL in script.js
 */

// Replace with your Google Sheets ID (just the ID, not the full URL)
const SHEET_ID = '1npaiupaTYK9_z5buk3YgCGKrLkcjoEeGj4Zc28Xq4l0';
const SHEET_NAME = 'RSVP Responses';

/**
 * Handle GET requests - This handles CORS preflight
 */
function doGet(e) {
  // Return JSON response indicating the endpoint is working
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'RSVP endpoint is working',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests from the RSVP form
 */
function doPost(e) {
  try {
    // When using FormData, the data is in the 'parameter' property.
    // The key 'postData' must match what we used in script.js's formData.append()
    const data = JSON.parse(e.parameter.postData);
    console.log('Received RSVP data:', data);

    const result = storeRSVPData(data);

    // Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'RSVP received successfully',
        result: result
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error processing RSVP:', error);

    // Return an error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to process RSVP',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Store RSVP data in Google Sheets
 */
function storeRSVPData(data) {
  try {
    // Open the Google Sheets document
    const sheet = getOrCreateSheet();
    
    // Process additional guests data
    const additionalGuestsText = Array.isArray(data.additionalGuests) 
      ? data.additionalGuests.join(', ') 
      : data.additionalGuests || '';
    
    // Prepare the row data
    const rowData = [
      data.submittedAt || new Date().toLocaleString(),
      data.fullName || '',
      data.contactNumber || '',
      data.attendance || '',
      data.guestCount || '1',
      //additionalGuestsText,
      data.message || ''
    ];
    
    // If there are individual guest names, add them to separate columns
    if (Array.isArray(data.additionalGuests) && data.additionalGuests.length > 0) {
      // Add individual guest names to additional columns
      data.additionalGuests.forEach((guestName, index) => {
        rowData.push(guestName);
      });
    }
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Send email notification (optional)
    sendEmailNotification(data);
    
    return 'Data stored successfully';
    
  } catch (error) {
    console.error('Error storing RSVP data:', error);
    throw error;
  }
}

/**
 * Get or create the RSVP sheet with headers
 */
function getOrCreateSheet() {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Try to get the existing sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'Submitted At',
        'Full Name',
        'Contact Number',
        'Attendance',
        'Guest Count',
        'Message',
        'Guest 2',
        'Guest 3',
        'Guest 4',
        'Guest 5',
        'Guest 6',
        'Guest 7',
        'Guest 8',
        'Guest 9',
        'Guest 10'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#8c7851');
      headerRange.setFontColor('#ffffff');
      
      // Set column widths
      sheet.setColumnWidth(1, 150); // Submitted At
      sheet.setColumnWidth(2, 200); // Full Name
      sheet.setColumnWidth(3, 150); // Contact Number
      sheet.setColumnWidth(4, 120); // Attendance
      sheet.setColumnWidth(5, 100); // Guest Count
      sheet.setColumnWidth(6, 300); // Message
      sheet.setColumnWidth(7, 200); // Guest 2
      sheet.setColumnWidth(8, 200); // Guest 3
      sheet.setColumnWidth(9, 200); // Guest 4
      sheet.setColumnWidth(10, 200); // Guest 5
      sheet.setColumnWidth(11, 200); // Guest 6
      sheet.setColumnWidth(12, 200); // Guest 7
      sheet.setColumnWidth(13, 200); // Guest 8
      sheet.setColumnWidth(14, 200); // Guest 9
      sheet.setColumnWidth(15, 200); // Guest 10
    }
    
    return sheet;
    
  } catch (error) {
    console.error('Error getting/creating sheet:', error);
    throw error;
  }
}

/**
 * Send email notification for new RSVP (optional)
 * Replace 'your-email@example.com' with your actual email
 */
function sendEmailNotification(data) {
  try {
    const emailAddress = 'williamh.otieno@gmail.com'; // Replace with your email
    const subject = 'New Wedding RSVP Received';
    
    const emailBody = `
      A new RSVP has been received for Jap & Shu Lee's wedding:
      
      Name: ${data.fullName}
      Contact: ${data.contactNumber}
      Attendance: ${data.attendance}
      Number of Guests: ${data.guestCount}
      Additional Guests: ${Array.isArray(data.additionalGuests) ? data.additionalGuests.join(', ') : data.additionalGuests || 'None'}
      Message: ${data.message || 'None'}
      
      Submitted: ${data.submittedAt}
      
      Check the RSVP spreadsheet for full details.
    `;
    
    // Uncomment the line below to enable email notifications
    // MailApp.sendEmail(emailAddress, subject, emailBody);
    
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw error here as it's not critical
  }
}

/**
 * Test function to verify the script is working
 * Run this function from the Apps Script editor to test
 */
function testScript() {
  const testData = {
    fullName: 'Test User',
    contactNumber: '555-0123',
    attendance: 'yes',
    guestCount: '2',
    additionalGuests: ['Jane Doe'],
    message: 'Looking forward to the wedding!',
    submittedAt: new Date().toLocaleString()
  };
  
  try {
    const result = storeRSVPData(testData);
    console.log('Test successful:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

/**
 * Get RSVP statistics (optional utility function)
 */
function getRSVPStats() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { totalResponses: 0, attending: 0, notAttending: 0, totalGuests: 0 };
    }
    
    let attending = 0;
    let notAttending = 0;
    let totalGuests = 0;
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const attendance = data[i][3]; // Attendance column
      const guestCount = parseInt(data[i][4]) || 1; // Guest count column
      
      if (attendance === 'yes') {
        attending++;
        totalGuests += guestCount;
      } else if (attendance === 'no') {
        notAttending++;
      }
    }
    
    return {
      totalResponses: data.length - 1,
      attending: attending,
      notAttending: notAttending,
      totalGuests: totalGuests
    };
    
  } catch (error) {
    console.error('Error getting RSVP stats:', error);
    return null;
  }
}

/**
 * Setup function to prepare the spreadsheet
 * Run this once to set up your sheet structure
 */
function setupSpreadsheet() {
  try {
    const sheet = getOrCreateSheet();
    console.log('Spreadsheet setup complete');
    console.log('Sheet URL:', SpreadsheetApp.openById(SHEET_ID).getUrl());
  } catch (error) {
    console.error('Setup failed:', error);
  }
}