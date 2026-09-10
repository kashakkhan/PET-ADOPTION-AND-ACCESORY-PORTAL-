package com.pawsconnect.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String breed;
    private Integer age;
    private String description;
    private String imageUrl;
    
    private String vaccinationStatus;
    private String disease;

    @Enumerated(EnumType.STRING)
    private PetStatus status = PetStatus.AVAILABLE;

    @Version
    private Long version;

    @ManyToOne
    @JoinColumn(name = "ngo_id")
    @JsonIgnore
    private Ngo ngo;

    public Pet() {}
    public Pet(String name, String breed, Integer age, String description, String imageUrl, String vaccinationStatus, String disease) {
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.description = description;
        this.imageUrl = imageUrl;
        this.vaccinationStatus = vaccinationStatus;
        this.disease = disease;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getVaccinationStatus() { return vaccinationStatus; }
    public void setVaccinationStatus(String vaccinationStatus) { this.vaccinationStatus = vaccinationStatus; }
    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }
    public PetStatus getStatus() { return status; }
    public void setStatus(PetStatus status) { this.status = status; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public Ngo getNgo() { return ngo; }
    public void setNgo(Ngo ngo) { this.ngo = ngo; }
    @Transient
    public String getNgoName() { return ngo != null ? ngo.getName() : null; }
}
