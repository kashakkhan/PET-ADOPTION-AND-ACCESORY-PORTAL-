package com.pawsconnect.controller;

import com.pawsconnect.model.Ngo;
import com.pawsconnect.repository.NgoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
@CrossOrigin(origins = "*")
public class NgoController {

    @Autowired
    private NgoRepository ngoRepository;

    @GetMapping("/nearby")
    public List<Ngo> getNearbyNgos(@RequestParam("lat") Double lat, 
                                   @RequestParam("lng") Double lng, 
                                   @RequestParam("radius") Double radius) {
        return ngoRepository.findNgosWithinRadius(lat, lng, radius);
    }
}
