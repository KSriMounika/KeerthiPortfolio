// Particle Background Animation
class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById("particleCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.particles = []
    this.colors = [
  "lab(38.93% 33.84 -44.68)",
  "lab(70.93% 18.14 -31.01)"
];

    this.init()
    this.animate()
    this.handleResize()
  }

  init() {
    this.resizeCanvas()
    this.createParticles()
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    this.particles = []
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 20))

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
      })
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Update and draw particles
    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1

      // Draw particle
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = particle.color
      this.ctx.fill()
    })

    // Draw connections
    this.particles.forEach((particle, i) => {
      this.particles.slice(i + 1).forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          this.ctx.beginPath()
          this.ctx.moveTo(particle.x, particle.y)
          this.ctx.lineTo(otherParticle.x, otherParticle.y)
          this.ctx.strokeStyle = `rgba(196, 181, 253, ${0.15 * (1 - distance / 120)})`
          this.ctx.lineWidth = 1
          this.ctx.stroke()
        }
      })
    })

    requestAnimationFrame(() => this.animate())
  }

  handleResize() {
    window.addEventListener("resize", () => {
      this.resizeCanvas()
      this.createParticles()
    })
  }
}

// Typewriter Effect
class TypeWriter {
  constructor(element, texts, speed = 100) {
    this.element = element
    this.texts = texts
    this.speed = speed
    this.textIndex = 0
    this.charIndex = 0
    this.isDeleting = false
    this.start()
  }

  start() {
    this.type()
  }

  type() {
    const currentText = this.texts[this.textIndex]

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1)
      this.charIndex--
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1)
      this.charIndex++
    }

    let typeSpeed = this.speed

    if (this.isDeleting) {
      typeSpeed /= 2
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000
      this.isDeleting = true
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false
      this.textIndex = (this.textIndex + 1) % this.texts.length
      typeSpeed = 500
    }

    setTimeout(() => this.type(), typeSpeed)
  }
}

// Smooth Scrolling
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  }
}
class NavbarController {
  constructor() {
    this.navbar = document.getElementById("navbar")
    this.navToggle = document.getElementById("nav-toggle")
    this.navMenu = document.getElementById("nav-menu")
    this.init()
  }

  init() {
    this.handleScroll()
    this.handleMobileMenu()
    this.handleResize()
  }

  handleScroll() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        this.navbar.classList.add("scrolled")
      } else {
        this.navbar.classList.remove("scrolled")
      }
    })
  }

  handleMobileMenu() {
    this.navToggle.addEventListener("click", () => {
      if (window.innerWidth <= 425) { // ✅ only on mobile
        this.navMenu.classList.toggle("active")
        this.navToggle.classList.toggle("active")
      }
    })

    // Close menu after clicking a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 425) {
          this.navMenu.classList.remove("active")
          this.navToggle.classList.remove("active")
        }
      })
    })
  }

  handleResize() {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 425) {
        this.navMenu.classList.remove("active")
        this.navToggle.classList.remove("active")
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new NavbarController()
})




// Intersection Observer for Animations
class AnimationController {
  constructor() {
    this.init()
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-50px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
          this.animateSkillBars(entry.target)
          this.animateCounters(entry.target)
        }
      })
    }, observerOptions)

    // Observe sections
    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section)
    })

    // Observe individual elements
    document
      .querySelectorAll(".skill-category, .project-card, .achievement-card, .certification-card")
      .forEach((el) => {
        observer.observe(el)
      })
  }

  animateSkillBars(target) {
    if (target.id === "skills") {
      const skillBars = target.querySelectorAll(".skill-progress")
      skillBars.forEach((bar, index) => {
        setTimeout(() => {
          const width = bar.getAttribute("data-width")
          bar.style.width = width + "%"
        }, index * 200)
      })
    }
  }

  animateCounters(target) {
    if (target.id === "achievements") {
      const counters = target.querySelectorAll(".stat-value")
      counters.forEach((counter) => {
        const finalValue = counter.textContent
        const numericValue = Number.parseInt(finalValue.replace(/\D/g, ""))
        const suffix = finalValue.replace(/\d/g, "")

        let currentValue = 0
        const increment = numericValue / 50

        const timer = setInterval(() => {
          currentValue += increment
          if (currentValue >= numericValue) {
            counter.textContent = numericValue + suffix
            clearInterval(timer)
          } else {
            counter.textContent = Math.floor(currentValue) + suffix
          }
        }, 50)
      })
    }
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm")
    this.submitBtn = document.getElementById("submitBtn")
    this.init()
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    this.addInputValidation()
  }

  addInputValidation() {
    const inputs = this.form.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearError(input))
    })
  }

  validateField(field) {
    const value = field.value.trim()
    const errorElement = document.getElementById(field.name + "Error")

    let isValid = true
    let errorMessage = ""

    switch (field.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          isValid = false
          errorMessage = "Please enter a valid email address"
        }
        break
      case "text":
        if (value.length < 2) {
          isValid = false
          errorMessage = "Name must be at least 2 characters long"
        }
        break
      default:
        if (value.length < 10) {
          isValid = false
          errorMessage = "Message must be at least 10 characters long"
        }
    }

    if (!isValid) {
      errorElement.textContent = errorMessage
      errorElement.classList.add("show")
      field.style.borderColor = "#ef4444"
    } else {
      this.clearError(field)
    }

    return isValid
  }

  clearError(field) {
    const errorElement = document.getElementById(field.name + "Error")
    errorElement.classList.remove("show")
    field.style.borderColor = ""
  }

  async handleSubmit(e) {
    e.preventDefault()

    // Validate all fields
    const inputs = this.form.querySelectorAll("input, textarea")
    let isFormValid = true

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false
      }
    })

    if (!isFormValid) return

    // Show loading state
    this.submitBtn.classList.add("loading")
    this.submitBtn.disabled = true

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      this.showToast("Message sent successfully!", "success")
      this.form.reset()
    } catch (error) {
      this.showToast("Failed to send message. Please try again.", "error")
    } finally {
      this.submitBtn.classList.remove("loading")
      this.submitBtn.disabled = false
    }
  }

  showToast(message, type) {
    const toast = document.getElementById("toast")
    const toastMessage = toast.querySelector(".toast-message")

    toastMessage.textContent = message
    toast.className = `toast ${type}`
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
    }, 4000)
  }
}

// Skill Hover Effects
class SkillInteractions {
  constructor() {
    this.init()
  }

  init() {
    const skillItems = document.querySelectorAll(".skill-item")
    skillItems.forEach((item) => {
      item.addEventListener("mouseenter", () => this.showDescription(item))
      item.addEventListener("mouseleave", () => this.hideDescription(item))
    })
  }

  showDescription(item) {
    const description = item.getAttribute("data-desc")
    if (description) {
      let descElement = item.querySelector(".skill-description")
      if (!descElement) {
        descElement = document.createElement("p")
        descElement.className = "skill-description"
        descElement.style.cssText = `
                    font-size: 0.75rem;
                    color: #c4b5fd;
                    margin-top: 0.5rem;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                `
        item.appendChild(descElement)
      }
      descElement.textContent = description
      setTimeout(() => {
        descElement.style.opacity = "1"
        descElement.style.transform = "translateY(0)"
      }, 10)
    }
  }

  hideDescription(item) {
    const descElement = item.querySelector(".skill-description")
    if (descElement) {
      descElement.style.opacity = "0"
      descElement.style.transform = "translateY(-10px)"
      setTimeout(() => {
        if (descElement.parentNode) {
          descElement.parentNode.removeChild(descElement)
        }
      }, 300)
    }
  }
}

// Project Card Interactions
class ProjectInteractions {
  constructor() {
    this.init()
  }

  init() {
    const projectCards = document.querySelectorAll(".project-card")
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", () => this.handleHover(card, true))
      card.addEventListener("mouseleave", () => this.handleHover(card, false))
    })
  }

  handleHover(card, isHovering) {
    const overlay = card.querySelector(".project-overlay")
    const features = card.querySelector(".project-features")

    if (isHovering) {
      if (overlay) overlay.style.opacity = "1"
      if (features) {
        features.style.opacity = "1"
        features.style.transform = "translateY(0)"
      }
    } else {
      if (overlay) overlay.style.opacity = "0"
    }
  }
}

// Achievement Card Interactions
class AchievementInteractions {
  constructor() {
    this.init()
  }

  init() {
    const achievementCards = document.querySelectorAll(".achievement-card")
    achievementCards.forEach((card) => {
      card.addEventListener("mouseenter", () => this.showDetails(card))
      card.addEventListener("mouseleave", () => this.hideDetails(card))
    })
  }

  showDetails(card) {
    const details = card.querySelector(".achievement-details")
    if (details) {
      details.style.opacity = "1"
      details.style.transform = "translateY(0)"
    }
  }

  hideDetails(card) {
    const details = card.querySelector(".achievement-details")
    if (details) {
      details.style.opacity = "0"
      details.style.transform = "translateY(10px)"
    }
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init()
  }

  init() {
    this.lazyLoadImages()
    this.optimizeAnimations()
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]")
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute("data-src")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency < 4) {
      document.body.classList.add("reduced-motion")
    }

    // Pause animations when tab is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.body.classList.add("paused-animations")
      } else {
        document.body.classList.remove("paused-animations")
      }
    })
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  new ParticleBackground()
  new NavbarController()
  new SmoothScroll()
  new AnimationController()
  new ContactForm()
  new SkillInteractions()
  new ProjectInteractions()
  new AchievementInteractions()
  new PerformanceOptimizer()

  // Initialize typewriter effect
  const typewriterElement = document.getElementById("typewriter")
  if (typewriterElement) {
    new TypeWriter(
      typewriterElement,
      ["Software Developer", "Full Stack Engineer", "Problem Solver", "Tech Enthusiast"],
      100,
    )
  }

  // Add loading animation
  document.body.classList.add("loaded")

  // Initialize skill progress bars
  setTimeout(() => {
    document.querySelectorAll(".skill-progress").forEach((bar) => {
      const width = bar.getAttribute("data-width")
      if (width) {
        bar.style.width = width + "%"
      }
    })
  }, 1000)

  // Add scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document
    .querySelectorAll(
      ".about-paragraph, .trait, .skill-category, .project-card, .achievement-card, .certification-card",
    )
    .forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "all 0.6s ease"
      observer.observe(el)
    })

  console.log("🚀 Portfolio loaded successfully!")
})

// Add some additional CSS for loading states and animations
const additionalStyles = `
    .loaded {
        animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .paused-animations * {
        animation-play-state: paused !important;
    }

    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    .skill-description {
        animation: slideInUp 0.3s ease;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`

// Inject additional styles
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)
