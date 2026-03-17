package com.helleyx.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_orders")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerOrder {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name",    nullable = false, length = 100) private String firstName;
    @Column(name = "last_name",     nullable = false, length = 100) private String lastName;
    @Column(name = "email",         nullable = false, length = 255) private String email;
    @Column(name = "phone_number",  nullable = false, length = 20)  private String phoneNumber;
    @Column(name = "street_address",nullable = false, length = 255) private String streetAddress;
    @Column(name = "city",          nullable = false, length = 100) private String city;
    @Column(name = "state",         nullable = false, length = 100) private String state;
    @Column(name = "postal_code",   nullable = false, length = 20)  private String postalCode;
    @Column(name = "country",       nullable = false, length = 100) private String country;
    @Column(name = "product",       nullable = false, length = 255) private String product;

    @Column(name = "quantity",     nullable = false)                 private Integer quantity;
    @Column(name = "unit_price",   nullable = false, precision = 10, scale = 2) private BigDecimal unitPrice;
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2) private BigDecimal totalAmount;

    @Column(name = "status",       nullable = false, length = 50)  private String status;
    @Column(name = "created_by",   nullable = false, length = 100) private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist @PreUpdate
    public void calcTotal() {
        if (quantity != null && unitPrice != null)
            this.totalAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
