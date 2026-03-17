package com.helleyx.dashboard.repository;

import com.helleyx.dashboard.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    @Query("SELECT o FROM CustomerOrder o WHERE o.createdAt >= :start")
    List<CustomerOrder> findByCreatedAtAfter(@Param("start") LocalDateTime start);

    @Query("SELECT o FROM CustomerOrder o WHERE o.createdAt BETWEEN :start AND :end")
    List<CustomerOrder> findByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
