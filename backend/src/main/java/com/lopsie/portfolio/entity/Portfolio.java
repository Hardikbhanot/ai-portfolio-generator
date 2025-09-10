package com.lopsie.portfolio.entity;

import jakarta.persistence.*;

@Entity
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use @Lob for potentially long text fields, or specify TEXT type
    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String skills; // Will store a JSON array of strings

    @Column(columnDefinition = "TEXT")
    private String projects; // Will store a JSON array of project objects

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}