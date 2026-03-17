package com.helleyx.dashboard.repository;

import com.helleyx.dashboard.entity.Widget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {
    List<Widget> findByDashboardLayoutId(Long layoutId);
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByDashboardLayoutId(Long layoutId);
}
