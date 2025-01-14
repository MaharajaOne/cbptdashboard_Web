import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Button, Collapse } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';


const Sidebar = ({ sidebarItems }) => {
  const [openMonthlyReport, setOpenMonthlyReport] = useState(false);

  const toggleMonthlyReportSubmenu = () => {
    setOpenMonthlyReport(!openMonthlyReport);
  };


  return (
      <div
        style={{
          width: '280px',
          height: '100vh',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #dee2e6',
          paddingTop: '20px',
        }}
      >
      <div className="d-flex flex-column flex-shrink-0">
          <Nav variant="pills" className="flex-column mb-auto">
            {sidebarItems.map((item, index) => {
              if (item === 'Monthly Report') {
                return (
                  <Nav.Item key={index}>
                    <Button
                      variant="link"
                      onClick={toggleMonthlyReportSubmenu}
                      aria-controls="monthly-report-collapse"
                      aria-expanded={openMonthlyReport}
                      block
                      className="text-start px-3 py-2 text-decoration-none"
                      style={{
                        fontWeight: 'bold',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#212529',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {item}
                      {openMonthlyReport ? <FaChevronUp /> : <FaChevronDown />}
                    </Button>
                    <Collapse in={openMonthlyReport}>
                      <div id="monthly-report-collapse">
                          <Nav className="flex-column mt-2">
                              <Nav.Item>
                                <Nav.Link as={Link} to="/monthlyreport/delivery" className="text-dark pl-3 ms-4" >
                                  Delivery
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link as={Link} to="/monthlyreport/quality" className="text-dark pl-3 ms-4">
                                  Quality
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link as={Link} to="/monthlyreport/employeeproductivity" className="text-dark pl-3 ms-4">
                                  Productivity
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                        </div>
                    </Collapse>
                  </Nav.Item>
                );
              } else {
                return (
                  <Nav.Item key={index}>
                    <Nav.Link
                      as={Link}
                      to={`/${item.toLowerCase().replace(' ', '')}`}
                      className="text-decoration-none px-3 py-2 text-dark"
                    >
                      {item}
                    </Nav.Link>
                  </Nav.Item>
                );
              }
            })}
          </Nav>
        </div>
    </div>
  );
};

export default Sidebar;