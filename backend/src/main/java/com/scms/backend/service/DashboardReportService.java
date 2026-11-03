package com.scms.backend.service;

import com.scms.backend.dto.DashboardStatsResponse;
import com.scms.backend.entity.*;
import com.scms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardReportService {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final PaymentRepository paymentRepository;
    private final ClassRepository classRepository;
    private final ClassRegistrationRepository registrationRepository;

    public DashboardStatsResponse getDashboardStats() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();

        Map<String, Long> membersByRole = users.stream()
                .collect(Collectors.groupingBy(u -> u.getRole().name(), Collectors.counting()));

        List<Membership> activeMemberships = membershipRepository.findByStatus(Membership.Status.Active);
        long activeMembers = activeMemberships.size();

        LocalDate soon = LocalDate.now().plusDays(14);
        long expiringCount = activeMemberships.stream()
                .filter(m -> !m.getEndDate().isAfter(soon))
                .count();

        Map<String, Long> packageDistribution = new HashMap<>();
        for (Membership m : activeMemberships) {
            String pkgName = m.getMembershipPackage().getName();
            packageDistribution.put(pkgName, packageDistribution.getOrDefault(pkgName, 0L) + 1);
        }

        List<Payment> paidPayments = paymentRepository.findByStatus(Payment.Status.Paid);
        BigDecimal totalRevenue = paidPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ClassEntity> classes = classRepository.findAll();
        long totalClasses = classes.size();
        long upcoming = classes.stream().filter(c -> c.getStatus() == ClassEntity.Status.Upcoming).count();
        long completed = classes.stream().filter(c -> c.getStatus() == ClassEntity.Status.Completed).count();

        long totalRegistrations = registrationRepository.count();

        return new DashboardStatsResponse(
                totalUsers,
                activeMembers,
                expiringCount,
                totalRevenue,
                totalClasses,
                upcoming,
                completed,
                totalRegistrations,
                membersByRole,
                packageDistribution
        );
    }
}
