package com.scms.backend.service;

import com.scms.backend.dto.PackageRequest;
import com.scms.backend.entity.MembershipPackage;
import com.scms.backend.exception.*;
import com.scms.backend.repository.MembershipPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipPackageService {

    private final MembershipPackageRepository packageRepository;

    public List<MembershipPackage> getAllActivePackages() {
        return packageRepository.findByIsActiveTrue();
    }

    public List<MembershipPackage> getAllPackages() {
        return packageRepository.findAll();
    }

    public MembershipPackage getPackageById(Integer id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MembershipPackage", "id", id));
    }

    @Transactional
    public MembershipPackage createPackage(PackageRequest request) {
        if (packageRepository.existsByName(request.name())) {
            throw new DuplicateResourceException("MembershipPackage", "name", request.name());
        }

        MembershipPackage pkg = MembershipPackage.builder()
                .name(request.name())
                .description(request.description())
                .durationDays(request.durationDays())
                .price(request.price())
                .isActive(true)
                .build();

        return packageRepository.save(pkg);
    }

    @Transactional
    public MembershipPackage updatePackage(Integer id, PackageRequest request) {
        MembershipPackage pkg = getPackageById(id);

        if (!pkg.getName().equals(request.name()) && packageRepository.existsByName(request.name())) {
            throw new DuplicateResourceException("MembershipPackage", "name", request.name());
        }

        pkg.setName(request.name());
        pkg.setDescription(request.description());
        pkg.setDurationDays(request.durationDays());
        pkg.setPrice(request.price());

        return packageRepository.save(pkg);
    }

    @Transactional
    public MembershipPackage toggleActive(Integer id) {
        MembershipPackage pkg = getPackageById(id);
        pkg.setIsActive(!pkg.getIsActive());
        return packageRepository.save(pkg);
    }
}
