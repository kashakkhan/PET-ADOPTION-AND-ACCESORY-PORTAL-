package com.pawsconnect.repository;

import com.pawsconnect.model.Pet;
import com.pawsconnect.model.PetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findTop3ByStatusOrderByIdAsc(PetStatus status);
    List<Pet> findByStatus(PetStatus status);
}
