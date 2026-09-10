package com.pawsconnect.controller;

import com.pawsconnect.model.Pet;
import com.pawsconnect.model.PetStatus;
import com.pawsconnect.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @GetMapping("/featured")
    public List<Pet> getFeaturedPets() {
        return petRepository.findTop3ByStatusOrderByIdAsc(PetStatus.AVAILABLE);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return petRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pet createPet(@RequestBody Pet pet) {
        return petRepository.save(pet);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Pet> updatePetStatus(@PathVariable Long id, @RequestParam PetStatus status) {
        return petRepository.findById(id)
            .map(pet -> {
                pet.setStatus(status);
                return ResponseEntity.ok(petRepository.save(pet));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
