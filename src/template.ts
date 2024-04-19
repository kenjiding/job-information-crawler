import { ISearchResult } from './types';


function generateTable(searchResults: ISearchResult[]) {
  return searchResults.map(result => {
      return `
        <tr>
          <td>${result.jobTitle}</td>
          <td>${result.companyName}</td>
          <td>${result.jobLocation}</td>
          <td>${result.jobDescription}</td>
          <td>${result.componyInfo}</td>
          <td><a href="${result.jobUrl}" target="_blank">Apply</a></td>
        </tr>
      `;
  }).join('');
}


export const getEmailTemplate = ({
  data,
  subject,
}: {
  data: ISearchResult[],
  subject: string,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Jobs Details</title>
      <style>
        .table-container {
          width: 100%;
          overflow-x: auto; /* Adds horizontal scroll */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px; /* Ensure table has a minimum width */
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        a {
          color: #069;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .subject {
          margin: 0 !important;
          background: #f7dec1;
          color: #069;
          text-align: center;
          padding: 15px;
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
          color: #069;
        }
      </style>
    </head>
    <body>
      <h1 class="subject">${subject}</h1>
      <table id="resultsTable">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Company Info</th>
            <th>More Info</th>
          </tr>
        </thead>
        <tbody>
        ${generateTable(data)}
        </tbody>
      </table>
    </body>
    </html>
  `;
};