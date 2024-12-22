export const bloodGroups = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
];

export const documentTypes = {
  IDENTITY: [
    {
      key: 'AADHAR',
      label: 'Aadhar Card',
      path: 'aadharFilePath',
      description: 'Upload Aadhar Card (PDF or Image)'
    },
    {
      key: 'PAN',
      label: 'PAN Card',
      path: 'panFilePath',
      description: 'Upload PAN Card (PDF or Image)'
    },
    {
      key: 'VOTER_ID',
      label: 'Voter ID',
      path: 'voterIdFilePath',
      description: 'Upload Voter ID (PDF or Image)'
    },
    {
      key: 'DRIVING_LICENSE',
      label: 'Driving License',
      path: 'drivingLicenseFilePath',
      description: 'Upload Driving License (PDF or Image)'
    }
  ],
  EDUCATION: [
    {
      key: 'SSLC',
      label: 'SSLC Certificate',
      path: 'sslcFilePath',
      description: 'Upload SSLC Certificate (PDF or Image)'
    },
    {
      key: 'HSC',
      label: 'HSC Certificate',
      path: 'hscFilePath',
      description: 'Upload HSC Certificate (PDF or Image)'
    },
    {
      key: 'DEGREE',
      label: 'Degree Certificate',
      path: 'degreeFilePath',
      description: 'Upload Degree Certificate (PDF or Image)'
    }
  ],
  EMPLOYMENT: [
    {
      key: 'RESUME',
      label: 'Resume',
      path: 'resumeFilePath',
      description: 'Upload Resume (PDF)'
    },
    {
      key: 'EXPERIENCE',
      label: 'Experience Certificate',
      path: 'experienceFilePath',
      description: 'Upload Experience Certificate (PDF or Image)'
    },
    {
      key: 'RELIEVING',
      label: 'Relieving Letter',
      path: 'relievingFilePath',
      description: 'Upload Relieving Letter (PDF or Image)'
    }
  ]
}; 