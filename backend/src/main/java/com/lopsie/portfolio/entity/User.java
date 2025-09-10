package com.lopsie.portfolio.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails { // <-- IMPLEMENT UserDetails
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true) // <-- Ensure emails are unique
    private String email;

    private String password; // This will be the hashed password

    // --- UserDetails Methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For now, every user has a simple "USER" role. You can make this more complex later.
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        // Spring Security will use the email as the unique username
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account is always valid
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account is never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials are never expired
    }

    @Override
    public boolean isEnabled() {
        return true; // Account is always enabled
    }

    // --- Your existing Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    @Override
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
