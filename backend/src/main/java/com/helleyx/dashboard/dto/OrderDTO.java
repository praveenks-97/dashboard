package com.helleyx.dashboard.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderDTO {
    private Long id;

    @NotBlank(message = "Please fill the field") private String firstName;
    @NotBlank(message = "Please fill the field") private String lastName;
    @NotBlank(message = "Please fill the field") @Email(message = "Invalid email") private String email;
    @NotBlank(message = "Please fill the field") private String phoneNumber;
    @NotBlank(message = "Please fill the field") private String streetAddress;
    @NotBlank(message = "Please fill the field") private String city;
    @NotBlank(message = "Please fill the field") private String state;
    @NotBlank(message = "Please fill the field") private String postalCode;
    @NotBlank(message = "Please fill the field") private String country;
    @NotBlank(message = "Please fill the field") private String product;

    @NotNull(message = "Please fill the field")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Please fill the field")
    @DecimalMin(value = "0.01", message = "Unit price must be > 0")
    private BigDecimal unitPrice;

    private BigDecimal totalAmount;

    @NotBlank(message = "Please fill the field") private String status;
    @NotBlank(message = "Please fill the field") private String createdBy;
    private LocalDateTime createdAt;
}
