package com.helleyx.dashboard.service;

import com.helleyx.dashboard.dto.OrderDTO;
import com.helleyx.dashboard.entity.CustomerOrder;
import com.helleyx.dashboard.exception.ResourceNotFoundException;
import com.helleyx.dashboard.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByDateFilter(String filter) {
        LocalDateTime now = LocalDateTime.now();
        return switch (filter.toLowerCase()) {
            case "today"      -> orderRepository.findByCreatedAtAfter(now.toLocalDate().atStartOfDay()).stream().map(this::toDTO).collect(Collectors.toList());
            case "last7days"  -> orderRepository.findByCreatedAtAfter(now.minusDays(7)).stream().map(this::toDTO).collect(Collectors.toList());
            case "last30days" -> orderRepository.findByCreatedAtAfter(now.minusDays(30)).stream().map(this::toDTO).collect(Collectors.toList());
            case "last90days" -> orderRepository.findByCreatedAtAfter(now.minusDays(90)).stream().map(this::toDTO).collect(Collectors.toList());
            default           -> getAllOrders();
        };
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        return toDTO(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id)));
    }

    @Transactional
    public OrderDTO createOrder(OrderDTO dto) {
        CustomerOrder o = toEntity(dto);
        o.calcTotal();
        CustomerOrder saved = orderRepository.save(o);
        log.info("Created order id={}", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public OrderDTO updateOrder(Long id, OrderDTO dto) {
        CustomerOrder o = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        o.setFirstName(dto.getFirstName()); o.setLastName(dto.getLastName());
        o.setEmail(dto.getEmail());         o.setPhoneNumber(dto.getPhoneNumber());
        o.setStreetAddress(dto.getStreetAddress()); o.setCity(dto.getCity());
        o.setState(dto.getState());         o.setPostalCode(dto.getPostalCode());
        o.setCountry(dto.getCountry());     o.setProduct(dto.getProduct());
        o.setQuantity(dto.getQuantity());   o.setUnitPrice(dto.getUnitPrice());
        o.setStatus(dto.getStatus());       o.setCreatedBy(dto.getCreatedBy());
        o.calcTotal();
        return toDTO(orderRepository.save(o));
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id))
            throw new ResourceNotFoundException("Order not found: " + id);
        orderRepository.deleteById(id);
        log.info("Deleted order id={}", id);
    }

    // ── Mappers ────────────────────────────────────────────────────────────────
    private OrderDTO toDTO(CustomerOrder o) {
        return OrderDTO.builder()
                .id(o.getId()).firstName(o.getFirstName()).lastName(o.getLastName())
                .email(o.getEmail()).phoneNumber(o.getPhoneNumber())
                .streetAddress(o.getStreetAddress()).city(o.getCity())
                .state(o.getState()).postalCode(o.getPostalCode()).country(o.getCountry())
                .product(o.getProduct()).quantity(o.getQuantity()).unitPrice(o.getUnitPrice())
                .totalAmount(o.getTotalAmount()).status(o.getStatus())
                .createdBy(o.getCreatedBy()).createdAt(o.getCreatedAt()).build();
    }

    private CustomerOrder toEntity(OrderDTO dto) {
        return CustomerOrder.builder()
                .firstName(dto.getFirstName()).lastName(dto.getLastName())
                .email(dto.getEmail()).phoneNumber(dto.getPhoneNumber())
                .streetAddress(dto.getStreetAddress()).city(dto.getCity())
                .state(dto.getState()).postalCode(dto.getPostalCode()).country(dto.getCountry())
                .product(dto.getProduct()).quantity(dto.getQuantity()).unitPrice(dto.getUnitPrice())
                .totalAmount(BigDecimal.ZERO).status(dto.getStatus()).createdBy(dto.getCreatedBy())
                .build();
    }
}
