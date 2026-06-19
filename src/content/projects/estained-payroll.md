---
title: "Comprehensive Payroll System for a Small-Medium Enterprise"
description: "A web-based payroll and HR management system developed with Django, featuring automated workflows, role-based access control, and a streamlined CI/CD pipeline using Docker and GitHub Actions."
date: 2025-06-01
tags: ["web-development", "academic-service-learning", "project-management"]
stack: ["Django", "Docker", "GitHub Actions", "Figma"]
featured: true
---

## Overview
During this four-month academic service-learning project, our team partnered with a local SME to modernize their operational workflows. After identifying critical bottlenecks in their human resources and payroll processes, we designed and developed a centralized, automated web application to resolve productivity challenges and replace their manual data entry systems.

![image](/public/images/asl_1.png)

## Key Features
We successfully automated and consolidated their HR workflow by building a comprehensive platform with the following capabilities:

* **Automated Payroll Processing:** Dynamically calculates overtime, taxes, and custom deductions, alongside automated formatting for printable payroll documents.
* **Role-Based Access Control (RBAC):** Implemented strict security tiers, including an exclusive security audit log for high-privilege administrators, a dedicated management dashboard for HR, and restricted self-service portals for employees.
* **Employee Self-Service Portal:** Allows employees to independently track their personal data, view the company calendar, and submit applications for leaves and overtime.

![image](/public/images/asl_2.png)

## Technical Architecture & Deployment
The system was engineered using **Django** and containerized using **Docker** for consistent environment management. 

To ensure smooth maintenance for the client, we built a reliable CI/CD pipeline utilizing **GitHub Actions** and private repositories. The deployment architecture features an automated monthly polling system that checks for new updates. When a release is detected, it notifies the administrator and executes a seamless update process—pulling the latest code without crashing the application or disrupting the integrity of the live PostgreSQL database.

![image](/public/images/asl_3.png)