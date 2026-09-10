package com.pawsconnect.repository;

import com.pawsconnect.model.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {
    
    @Query(nativeQuery = true, value = "SELECT * FROM ngos n WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(n.latitude)) * cos(radians(n.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(n.latitude)))) <= :radius")
    List<Ngo> findNgosWithinRadius(@Param("lat") Double lat, @Param("lng") Double lng, @Param("radius") Double radius);
}
