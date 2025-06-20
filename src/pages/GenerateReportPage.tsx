import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SidePanel from '../components/ui/SidePanel';
import { Audit } from '../types';
import { managementClauses } from '../data/managementClauses';
import { annexAControls } from '../data/annexAControls';

interface GenerateReportPageProps {
  audits: Audit[];
}

const GenerateReportPage: React.FC<GenerateReportPageProps> = ({ audits }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('audit-info');
  const audit = audits.find(a => a.id === id);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setSidePanelOpen(true);
  };

  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">Audit not found</p>
        <Button onClick={() => navigate('/audits')}>Back to Audits</Button>
      </div>
    );
  }

  const sections = [
    { id: 'audit-info', title: '1. Audit Information' },
    { id: 'methodology', title: '2. Audit Preparation and Methodology' },
    { id: 'audit-trails', title: '3. Significant Audit Trails' },
    { id: 'findings', title: '4. Audit Findings' },
    { id: 'conclusions', title: '5. Conclusions and Recommendations' },
    { id: 'annex-a', title: '6. Annex A: Nonconformity Report' },
    { id: 'annex-b', title: '7. Annex B: Certification Information' },
    { id: 'annex-c', title: '8. Annex C: Surveillance Plan' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'audit-info':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">1.1. Organization Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Input label="Company name:" defaultValue={audit.name} readOnly />
                <Input label="Contract number:" />
                <Input label="Phone number:" />
                <Input label="Website:" />
                <Input label="Total number of employees:" type="number" />
                <Input label="Total number of employees within the scope:" type="number" />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Please provide justification for the employees that are not included in the certification scope.
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <Input label="Contact name:" />
                <Input label="Contact email:" type="email" />
                <Input label="Contact phone:" />
              </div>

              <div className="mt-8">
                <h4 className="text-base font-medium mb-4">Sites:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Street Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State, Province, Country</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zip Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"># of Employees</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[1, 2, 3, 4].map((siteNum) => (
                        <tr key={siteNum}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {siteNum} {siteNum === 1 ? '(main)' : ''}
                          </td>
                          <td className="px-4 py-3">
                            <Input className="!m-0" />
                          </td>
                          <td className="px-4 py-3">
                            <Input className="!m-0" />
                          </td>
                          <td className="px-4 py-3">
                            <Input className="!m-0" />
                          </td>
                          <td className="px-4 py-3">
                            <Input className="!m-0" />
                          </td>
                          <td className="px-4 py-3">
                            <Input className="!m-0" type="number" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mt-8 mb-4">1.2. Audit Information</h3>
            <div className="space-y-4">
              <Input label="Audit standard(s):" defaultValue={audit.framework} readOnly />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audit type:</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={audit.type === 'Initial'} readOnly />
                      <span>Initial Audit</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={audit.type === 'Recertification'} readOnly />
                      <span>Recertification</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={audit.type === 'Surveillance 1'} readOnly />
                      <span>Surveillance 1</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={audit.type === 'Surveillance 2'} readOnly />
                      <span>Surveillance 2</span>
                    </label>
                  </div>
                </div>
              </div>

              <Input 
                label="Date(s) of audit(s):" 
                defaultValue={new Date(audit.startDate).toLocaleDateString()}
                readOnly 
              />
              <Input label="Duration:" />
              <Input label="Audit team leader:" />
              <Input label="Additional team member(s):" />
              <Input label="Additional attendees and roles:" />

              <div className="mt-8">
                <h4 className="text-base font-medium mb-4">Sites Audited:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((siteNum) => (
                    <label key={siteNum} className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Site {siteNum} {siteNum === 1 ? '(main)' : ''}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mt-8 mb-4">1.3. Audit Scope</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification audit scope:
                </label>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <Input label="Date and version of scope statement:" />
              <Input label="Has scope changed since last audit?" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  All scope exclusions are appropriate and justified:
                </label>
                <p className="text-sm text-gray-500 italic mb-2">
                  Important Note* Excluded clauses in the audited Management System shall be put in the certificate
                </p>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 'methodology':
        return (
          <div className="space-y-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">2.1. Audit objectives</h3>
                <div className="space-y-4">
                  <p className="text-gray-800 italic">
                    The main purpose of this audit is to evaluate the implementation and effectiveness of the Information Security Management (ISMS) including evaluation of conformity to the requirements of ISO/IEC 27001:2022.
                  </p>
                  <div>
                    <p className="text-gray-800 italic mb-2">The specific objectives of this audit are to confirm that:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-800 italic">
                      <li>The organization has determined the boundaries and applicability of the MS in scope,</li>
                      <li>The management system conforms with all the requirements of the audit standard (Clause 4 to 10 of ISO/IEC 27001:2022),</li>
                      <li>The management system conforms with all applicable legal and regulatory requirements,</li>
                      <li>The management system is capable of achieving the objectives of the organization's policies,</li>
                      <li>The organization has established, implemented, maintained, and continually improved its MS, including the processes needed and their interactions, in accordance with the requirements of the ISO/IEC 27001:2022.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">2.2. Audit criteria</h3>
                <div className="space-y-4">
                  <p className="text-gray-800 italic">
                    The audit criteria (the set of requirements) for this audit are all normative clauses of ISO/IEC 27001:2022:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 text-gray-800 italic">
                    <li>Clause 4 – Context of the organization</li>
                    <li>Clause 5 – Leadership</li>
                    <li>Clause 6 – Planning</li>
                    <li>Clause 7 – Support</li>
                    <li>Clause 8 – Operation</li>
                    <li>Clause 9 – Performance evaluation</li>
                    <li>Clause 10 – Improvement</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">2.3. Audit methodology</h3>
                <div className="space-y-4">
                  <p className="text-gray-800 italic">
                    The audit team has conducted a process-based audit focusing on the significant aspects, risks and objectives. The auditors have used audit procedures to collect evidence in sufficient quantity and quality to validate the conformity of the management system of the organization. The use of audit procedures in a systematic way reduces the audit risk and reinforces the objectivity of the audit conclusions.
                  </p>
                  <p className="text-gray-800 italic">
                    The audit team has used a combination of evidence collection procedures to create their audit test plan. The audit methods used consisted of interviews, observations of activities, review of documentation and records, technical tests and analysis of sampling.
                  </p>
                  <p className="text-gray-800 italic">
                    The analysis procedure allows the audit team to draw conclusions concerning a whole by examining a part. It allows the auditor to estimate characteristics of a population by directly observing a part of the whole population. The sampling method used during this audit was a systematic sampling (or interval sampling) technique with a margin error of 3 to 5 %.
                  </p>
                  <p className="text-gray-800 italic">
                    Technical tests, including testing of the effectiveness of a process or control have not been performed by the auditors themselves. The operations have always been performed by the personnel of the auditee.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">2.4. Previous audit results</h3>
                <div className="space-y-4">
                  <p className="text-gray-800 italic">
                    The results of the last audit of this system have been reviewed, in preparation for this audit in particular to assure appropriate correction and corrective action have been implemented to address any nonconformity identified. This review has concluded that:
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-gray-800 italic">any nonconformity identified during previous audits has been corrected and the corrective action continues to be effective.</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-gray-800 italic">any nonconformity identified during previous audits hasn't been addressed adequately and the specific issue has been re-defined in the nonconformity section of this report</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-gray-800 italic">N/A (no previous audits or no nonconformities during the previous audit)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">2.5. Audit planning</h3>
                <div className="space-y-4">
                  <p className="text-gray-800 italic">
                    The team leader of the audit has established an initial contact with the auditee to make arrangement for this audit, including scheduling the dates. The team leader has validated the feasibility of the audit, the audit objectives, the audit scope, the location and the audit criteria.
                  </p>
                  <p className="text-gray-800 italic">
                    The audit plan was sent to the auditee, and it was confirmed before the opening meeting between the audit team and the auditee.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">2.6. Key people interviewed</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department / Process</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opening Meeting (Yes or No)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Meeting (Yes or No)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of interviewing</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[1, 2, 3, 4].map((row) => (
                        <tr key={row}>
                          <td className="px-6 py-4"><Input className="!m-0" /></td>
                          <td className="px-6 py-4"><Input className="!m-0" /></td>
                          <td className="px-6 py-4"><Input className="!m-0" /></td>
                          <td className="px-6 py-4">
                            <Select
                              className="!m-0"
                              options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' }
                              ]}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Select
                              className="!m-0"
                              options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' }
                              ]}
                            />
                          </td>
                          <td className="px-6 py-4"><Input className="!m-0" type="date" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">2.7. MSECB complaint and appeal process</h3>
                <div className="space-y-4">
                  <p className="text-gray-800 italic">
                    Any client may appeal any decision made by the audit team. Appeals must be in writing and are addressed using MSECB' procedure for handling appeals and disputes. If MSECB fails to resolve the appeal to the organization's satisfaction, the appeal can be escalated to MSECB Advisory Board.
                  </p>
                  <p className="text-gray-800 italic">
                    MSECB Complaint and Appeal Procedure: <a href="http://www.msecb.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.msecb.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'audit-trails':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#8B1F18] mb-6">4 Context of the organization</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18]">
                        Clause<br />Requirement
                      </th>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18] w-24">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18]">
                        Audit Evidence<br />
                        <span className="font-normal">Findings/justification of findings/specifics/notes</span>
                      </th>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18] w-24">
                        No. of NC
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {managementClauses
                      .filter(clause => clause.clauseNumber.startsWith('4'))
                      .map((clause) => (
                      <tr key={clause.clauseNumber} className="hover:bg-gray-50">
                        <td className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleItemClick(clause)}>
                          <div className="font-medium">{clause.clauseNumber}</div>
                          <div>{clause.requirement}</div>
                          <div className="flex items-center text-sm text-blue-600 mt-2">
                            <span>View details</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${clause.status === 'Acceptable' ? 'bg-green-100 text-green-800' : ''}
                            ${clause.status === 'Nonconformity' ? 'bg-red-100 text-red-800' : ''}
                            ${clause.status === 'Not Applicable' ? 'bg-gray-100 text-gray-800' : ''}`}
                          >
                            {clause.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {clause.evidence?.map((ev) => (
                            <div key={ev.id} className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{ev.fileName}</span>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {clause.nonConformities.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-[#8B1F18] mt-12 mb-6">A.5 Organizational controls</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18]">
                        Control Objective and Controls
                      </th>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18] w-24">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18]">
                        Audit Evidence<br />
                        <span className="font-normal">Findings/justification of findings/specifics/notes</span>
                      </th>
                      <th className="px-6 py-3 text-center font-bold text-white bg-[#8B1F18] w-24">
                        No. of NC
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {annexAControls
                      .filter(control => control.controlNumber.startsWith('A.5'))
                      .map((control) => (
                      <tr key={control.controlNumber} className="hover:bg-gray-50">
                        <td className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleItemClick(control)}>
                          <div className="font-medium">{control.controlNumber}</div>
                          <div>{control.requirement}</div>
                          <div className="mt-2 text-sm italic">Control: {control.control}</div>
                          <div className="flex items-center text-sm text-blue-600 mt-2">
                            <span>View details</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${control.status === 'Acceptable' ? 'bg-green-100 text-green-800' : ''}
                            ${control.status === 'Nonconformity' ? 'bg-red-100 text-red-800' : ''}
                            ${control.status === 'Not Applicable' ? 'bg-gray-100 text-gray-800' : ''}`}
                          >
                            {control.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {control.evidence?.map((ev) => (
                            <div key={ev.id} className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{ev.fileName}</span>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {control.nonConformities.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'findings':
        return (
          <div>
            <div className="bg-[#8B1F18] bg-opacity-10 p-4 mb-6">
              <h3 className="text-2xl font-bold text-[#8B1F18]">4. Audit findings</h3>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-900">
                The audit findings were communicated to the senior management of the organization during
                the closing meeting. The final conclusion of the audit results and recommendation by the
                audit team was also communicated to the management during the meeting.
              </p>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  4.1. Audit finding definition
                </h4>
                <p className="mb-4">The evaluation of the audit findings is based on the following definitions:</p>

                <div className="space-y-4">
                  <div className="bg-[#4A234A] text-white p-4 rounded-t-lg">
                    <h5 className="text-lg font-semibold">Major Nonconformities (MaNC)</h5>
                  </div>
                  <div className="bg-[#4A234A] bg-opacity-90 text-white p-4">
                    <p className="mb-2">The absence or total failure of a system to meet a requirement. It may be either:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>A number of minor nonconformities against one requirement can represent a total failure of the system and thus be considered a major nonconformance; or</li>
                      <li>Any nonconformance that would result in the probable shipment of a nonconforming product. A condition that may result in the failure or materially reduce the usability of the products or services for their intended purpose; or</li>
                      <li>A nonconformance that judgment and experience indicate is likely either to result in the failure of the ISMS system or to materially reduce its ability to assure controlled processes and products.</li>
                    </ul>
                  </div>

                  <div className="bg-[#8B1F18] text-white p-4">
                    <h5 className="text-lg font-semibold">Minor Nonconformities (MiNC)</h5>
                  </div>
                  <div className="bg-[#8B1F18] bg-opacity-90 text-white p-4">
                    <p className="mb-2">A nonconformance that judgment and experience indicate is not likely to result in the failure of the ISMS system or reduce its ability to assure controlled processes or products. It may be either:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>A failure in some part of the supplier's documented ISMS system relative to a requirement; or</li>
                      <li>A single observed lapse in following one item of a company's ISMS system.</li>
                    </ul>
                  </div>

                  <div className="bg-[#C41E3A] text-white p-4">
                    <h5 className="text-lg font-semibold">Observations (OBS)</h5>
                  </div>
                  <div className="bg-[#C41E3A] bg-opacity-90 text-white p-4">
                    <p>Any issues which are likely to become a NC, if not treated until the next audit are marked as observations (OBS). No response is required.</p>
                  </div>

                  <div className="bg-[#FF6B6B] text-white p-4">
                    <h5 className="text-lg font-semibold">Opportunities for Improvement (OFI)</h5>
                  </div>
                  <div className="bg-[#FF6B6B] bg-opacity-90 text-white p-4">
                    <p>If certain aspects which generally comply with the requirements of the standard should be improved, then they are marked as opportunities for improvement (OFI). These OFIs help to improve the management system as a whole or named processes. No response is required.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  4.2. Major nonconformities (see also Annex A)
                </h4>
                <p className="italic text-gray-600 mb-4">Please explain if there are major non-conformities found during the audit.</p>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe any major nonconformities..."
                />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  4.3. Minor nonconformities (see also Annex A)
                </h4>
                <p className="italic text-gray-600 mb-4">Please explain if there are minor non-conformities found during the audit.</p>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe any minor nonconformities..."
                />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  4.4. Observations
                </h4>
                <p className="italic text-gray-600 mb-4">Please list any noted observations or issues that can possibly turn to non-conformities.</p>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="List observations..."
                />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  4.5. Opportunities for improvement
                </h4>
                <p className="italic text-gray-600 mb-4">Please list any noted opportunities for improvement without any specific recommendations for correction.</p>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="List opportunities for improvement..."
                />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  4.6. Agreed follow-up activities
                </h4>
                <div className="space-y-4">
                  <p className="text-gray-900">
                    Nonconformities detailed here need to be addressed through the organization's corrective action
                    process, in accordance with the relevant corrective action requirements of the audit standard,
                    including actions to analyze the cause of the nonconformity, prevent recurrence, and complete the
                    maintained records.
                  </p>
                  <p className="text-gray-900">
                    Corrective actions to address the identified major nonconformities, shall be carried out immediately
                    and X Corp shall be notified of the actions taken within 30 days. To confirm the actions taken,
                    evaluate their effectiveness, and determine whether certification can be granted or continued, a
                    X Corp auditor will perform a follow up visit within 90 days.
                  </p>
                  <p className="text-gray-900">
                    Corrective actions to address the identified minor nonconformities shall be documented on an action
                    plan and be sent for review by the client to the auditor within 30 days. If the actions are deemed to be
                    satisfactory, they will be followed up during the next scheduled visit.
                  </p>
                  <p className="font-medium text-gray-900 mt-6">Nonconformities shall be addressed through the client's corrective action process, including:</p>
                  <ul className="list-disc pl-8 space-y-2 text-gray-900">
                    <li>Actions taken to determine the extent of and contain the specific nonconformance.</li>
                    <li>Root Cause (results of an investigation to determine the most basic cause(s) of the nonconformance).</li>
                    <li>Actions taken to correct the nonconformance and, in response to the root cause, to eliminate recurrence of the nonconformance.</li>
                    <li>Corrective action response shall be submitted to the X Corp Lead Auditor.</li>
                    <li>Client must maintain corrective action records, including objective evidence, for at least three (3) years.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'conclusions':
        return (
          <div className="space-y-6">
            <div className="bg-[#8B1F18] bg-opacity-10 p-4 mb-6">
              <h3 className="text-2xl font-bold text-[#8B1F18]">5. Conclusions and Recommendations</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  5.1. Audit conclusions
                </h4>
                <div className="space-y-4">
                  <p className="text-gray-600 italic mb-4">
                    The audit team conducted a process-based audit focusing on significant aspects/risks/objectives.
                    The audit methods used were interviews, observation of activities and review of documentation and records.
                  </p>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={6}
                    placeholder="Enter audit conclusions..."
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  5.2. Recommendations
                </h4>
                <div className="space-y-4">
                  <p className="text-gray-600 italic mb-4">
                    The audit team makes the following recommendations based on the audit evidence gathered:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Areas of focus for the next audit:
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                        placeholder="List areas to focus on in the next audit..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certification recommendation:
                      </label>
                      <Select
                        options={[
                          { value: 'grant', label: 'Grant certification' },
                          { value: 'continue', label: 'Continue certification' },
                          { value: 'suspend', label: 'Suspend certification' },
                          { value: 'withdraw', label: 'Withdraw certification' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'annex-a':
        return (
          <div className="space-y-6">
            <div className="bg-[#8B1F18] bg-opacity-10 p-4 mb-6">
              <h3 className="text-2xl font-bold text-[#8B1F18]">6. Annex A: Nonconformity Report</h3>
            </div>
            
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NC #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Standard Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3].map((row) => (
                      <tr key={row}>
                        <td className="px-6 py-4">
                          <Input className="!m-0" placeholder="NC-001" />
                        </td>
                        <td className="px-6 py-4">
                          <Select
                            className="!m-0"
                            options={[
                              { value: 'major', label: 'Major' },
                              { value: 'minor', label: 'Minor' }
                            ]}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input className="!m-0" placeholder="IT Department" />
                        </td>
                        <td className="px-6 py-4">
                          <Input className="!m-0" placeholder="Clause 4.1" />
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={2}
                            placeholder="Describe the nonconformity..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'annex-b':
        return (
          <div className="space-y-6">
            <div className="bg-[#8B1F18] bg-opacity-10 p-4 mb-6">
              <h3 className="text-2xl font-bold text-[#8B1F18]">7. Annex B: Certification Information</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  7.1. Certification Scope
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scope Statement:
                    </label>
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                      placeholder="Enter the certification scope statement..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scope Exclusions:
                    </label>
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      placeholder="List any scope exclusions..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  7.2. Certification Details
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Number:
                    </label>
                    <Input placeholder="Enter certificate number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Standard:
                    </label>
                    <Input defaultValue="ISO/IEC 27001:2022" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Certification Date:
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Certification Date:
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Expiry Date:
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Status:
                    </label>
                    <Select
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'suspended', label: 'Suspended' },
                        { value: 'withdrawn', label: 'Withdrawn' },
                        { value: 'expired', label: 'Expired' }
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  7.3. Certification Conditions
                </h4>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This certificate is issued under the following conditions:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>The certification was conducted in accordance with the certification agreement</li>
                    <li>The certification was conducted in accordance with the audit program</li>
                    <li>The organization maintains a documented management system that fulfills the requirements of the audit standard</li>
                    <li>The certificate remains the property of X Corp</li>
                    <li>The certificate is maintained and updated through scheduled annual surveillance audits</li>
                    <li>The certificate becomes invalid if surveillance audits are not performed according to schedule</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'annex-c':
        return (
          <div className="space-y-6">
            <div className="bg-[#8B1F18] bg-opacity-10 p-4 mb-6">
              <h3 className="text-2xl font-bold text-[#8B1F18]">8. Annex C: Surveillance Plan</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  8.1. Surveillance Schedule
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Audit Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration (Days)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Focus Areas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { type: 'Surveillance 1', dueMonths: 12 },
                        { type: 'Surveillance 2', dueMonths: 24 },
                        { type: 'Recertification', dueMonths: 36 }
                      ].map((audit) => (
                        <tr key={audit.type}>
                          <td className="px-6 py-4 text-sm text-gray-900">{audit.type}</td>
                          <td className="px-6 py-4">
                            <Input type="date" className="!m-0" />
                          </td>
                          <td className="px-6 py-4">
                            <Input type="number" className="!m-0" />
                          </td>
                          <td className="px-6 py-4">
                            <textarea
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              rows={2}
                              placeholder="Enter focus areas for this audit..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  8.2. Surveillance Requirements
                </h4>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    The following requirements must be met to maintain certification:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Surveillance audits shall be conducted at least once a calendar year, except in recertification years</li>
                    <li>Date of the first surveillance audit following initial certification shall not be more than 12 months from the certification decision date</li>
                    <li>All nonconformities must be addressed according to the requirements specified in section 4.6</li>
                    <li>The organization must maintain its management system according to the requirements of the standard</li>
                    <li>The organization must notify X Corp of any significant changes to its management system, organizational structure, or context</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#8B1F18] border-b-2 border-[#8B1F18] pb-2 mb-4">
                  8.3. Special Audits
                </h4>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    X Corp reserves the right to conduct special audits during the certification period:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Extensions to scope</li>
                    <li>Short-notice audits to investigate complaints</li>
                    <li>Follow-up on suspended clients</li>
                    <li>Changes to the organization's management system, organizational structure, or context that may affect certification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Report</h1>
          <p className="mt-2 text-gray-600">Create a detailed audit report for {audit.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/audits')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Audits
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Report Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                      ${activeSection === section.id
                        ? 'bg-[#8B1F18] text-white'
                        : 'hover:bg-gray-100'
                      }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-9">
          <Card>
            <CardContent className="p-6">
              {renderSection()}
            </CardContent>
          </Card>
        </div>
      </div>

      <SidePanel
        open={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        title={selectedItem?.clauseNumber || selectedItem?.controlNumber}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Requirement</h3>
              <p className="text-gray-600">{selectedItem.requirement}</p>
            </div>

            {selectedItem.control && (
              <div>
                <h3 className="text-lg font-medium mb-2">Control</h3>
                <p className="text-gray-600">{selectedItem.control}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-4">Evidence</h3>
              <div className="space-y-4">
                {selectedItem.evidence?.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{ev.fileName}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Evidence
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Notes</h3>
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                placeholder="Add notes about this requirement..."
              />
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
};

export default GenerateReportPage;