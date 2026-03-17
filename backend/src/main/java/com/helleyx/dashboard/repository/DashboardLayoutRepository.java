package com.helleyx.dashboard.repository;

import com.helleyx.dashboard.entity.DashboardLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DashboardLayoutRepository extends JpaRepository<DashboardLayout, Long> {
    java.util.Optional<DashboardLayout> findFirstByUserIdOrderByUpdatedAtDesc(String userId);
}
