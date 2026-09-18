# Title: "PawConnect" – Pet Adoption & NGO Management System

**Objective:** Build a full-stack web application using Java (Spring Boot / Advanced Java) that facilitates pet adoption, connects users with NGOs, and provides a geo-aware browsing experience.

## 1. Core Tech Stack Requirements:
*   **Backend:** Java (using Spring Boot, Spring Security, and Spring Data JPA).
*   **Database:** MySQL for relational data storage.
*   **Frontend:** HTML5, CSS3 (Tailwind CSS preferred), and JavaScript (ES6+). Use Thymeleaf for server-side rendering.
*   **APIs:** Integration with Google Maps API (for nearby NGO detection) and a dummy payment gateway for "Buying/Adopting" transactions.

## 2. User Roles & Features:
*   **Guest User:** Can browse the homepage and view a grid of animals (Dogs, Cats, Rabbits, etc.).
*   **Registered User:**
    *   Secure Login or Sign-up
    *   **Adopter Profile:** Captures identifying details, household living situation (e.g., House with Yard), allergy information, and a required Government ID upload for NGO visit verification.
    *   **Animal Detail Page:** Clicking an image opens a detailed profile (Breed, Age, Health History, NGO Name, Location).
    *   **Scheduling System:** A "Book a Visit" feature with a calendar picker to visit the NGO.
    *   **Adoption/Purchase:** A checkout workflow to complete the adoption/purchase process.
    *   **Geo-Location:** A "Near Me" button that filters NGOs and animals within a 20km radius using browser geolocation.
*   **Admin Portal:**
    *   Dashboard with statistics (total pets, pending adoptions).
    *   CRUD operations for Animals (Add/Edit/Delete pet listings).
    *   **NGO Management:** Verify and manage NGO partners.
    *   **Appointment Oversight:** View and manage scheduled visits.

## 3. Technical Architecture:
*   Follow the MVC (Model-View-Controller) pattern.
*   Implement RESTful Endpoints for fetching animal data and NGO locations.
*   Use JDBC or JPA for database connectivity.
*   Ensure Image Upload functionality for the admin to upload pet photos (stored locally or in a cloud bucket).

## 4. Design Instructions:
*   **UI Style:** Modern, clean, and empathetic. Use a warm color palette (Soft Oranges, Whites, and Teals).
*   **Responsiveness:** Must be fully mobile-responsive.
*   **Visuals:** Use high-quality card layouts for the pet listings and a sidebar for the Admin portal.

## Recommended Process (Instructions for AI/Dev):
> "Start by generating the Database Schema (ER Diagram logic) and the Maven/Gradle dependencies. Then, proceed to create the Entity classes for User, Animal, and NGO. After that, build the Controller logic for the pet browsing and scheduling features."

## 🛠️ Suggested Database Schema
To make sure your database is "Advanced Java" ready, ensure you have these tables:
*   **Users:** `id`, `name`, `email`, `password`, `role` (USER/ADMIN), `phone`
*   **Animals:** `id`, `species`, `breed`, `age`, `description`, `price`, `ngo_id`, `image_url`, `status` (Available/Adopted)
*   **NGOs:** `id`, `name`, `address`, `latitude`, `longitude`, `contact_info`
*   **Appointments:** `id`, `user_id`, `animal_id`, `visit_date`, `status` (Confirmed/Pending)

