<script setup>
import { ref, onMounted, watch, reactive } from 'vue';

const selectedProject = ref(null);
const isMenuOpen = ref(false);
const cursorPosition = ref({ x: 0, y: 0 });
const isHoveringInteractive = ref(false);

// Strapi collections
const projects = ref([]);
const abouts = ref([]);
const skills = ref([]);
const filteredSkills = ref([]);
const currentStatus = ref(null);
const contactInfos = ref(null);
const heroCard = ref(null);
const contactForm = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
});

// Fetch all collections from Strapi
const fetchCollections = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const API_TOKEN = import.meta.env.VITE_API_TOKEN;

    const headers = {
        Authorization: `Bearer ${API_TOKEN}`,
    };

    try {
        // Fetch Projects
        const projectsRes = await fetch(`${API_URL}/api/projects?populate=*`, { headers });
        const projectsData = await projectsRes.json();
        projects.value = projectsData.data.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            shortDesc: item.shortDesc,
            description: item.description,
            date: item.date,
            client: item.client,
            role: item.role,
            image: item.image?.url
                ? `${API_URL}${item.image.url}`
                : '',
            tech: item.tech || [],
            liveLink: item.liveLink || '#',
            repoLink: item.repoLink || '#',
            process: item.process || [],
            challenges: item.challenges || [],
            solutions: item.solutions || [],
        }));

        // Fetch About
        const aboutRes = await fetch(`${API_URL}/api/abouts`, { headers });
        const aboutData = await aboutRes.json();
        abouts.value = aboutData.data;

        // Fetch Skills
        const skillsRes = await fetch(`${API_URL}/api/skills`, { headers });
        const skillsData = await skillsRes.json();
        skills.value = skillsData.data.map(item => item.name);

        // Fetch Current Status
        const statusRes = await fetch(`${API_URL}/api/current-statuses`, { headers });
        const statusData = await statusRes.json();
        currentStatus.value = statusData.data;

        // Fetch Contact Info
        const contactRes = await fetch(`${API_URL}/api/contact-infos`, { headers });
        const contactData = await contactRes.json();
        contactInfos.value = contactData.data;

        // Fetch Hero Card
        const heroRes = await fetch(`${API_URL}/api/hero-cards`, { headers });
        const heroData = await heroRes.json();
        heroCard.value = heroData.data;
    } catch (error) {
        console.error('Failed to fetch collections:', error);
    }
};

// Update cursor position based on mouse movement
const updateCursorPosition = (e) => {
    cursorPosition.value = { x: e.clientX, y: e.clientY };
};

// Select a project and scroll to the project section
const selectProject = (project) => {
    selectedProject.value = project;
    isMenuOpen.value = false;
    setTimeout(() => {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

// Filter skills based on the search input
const filterSkills = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
        filteredSkills.value = skills.value.filter(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } else {
        filteredSkills.value = skills.value;
    }
};

// Send email
const sendEmail = async (e) => {
  e.preventDefault();

  const API_URL = import.meta.env.VITE_API_URL;
  const API_TOKEN = import.meta.env.VITE_API_TOKEN;
  const API_EMAIL_RECEIVER = import.meta.env.VITE_API_EMAIL_RECEIVER;

  try {
    const response = await fetch(`${API_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        to: API_EMAIL_RECEIVER,
        from: contactForm.email,
        subject: 'techTahirou - Nouveau message de contact',
        text: `
            Nouveau message de contact
            Name: ${contactForm.name}
            Email: ${contactForm.email}
            Subject: ${contactForm.subject}
            Message: ${contactForm.message}
        `,
        html: `
            <h1>Nouveau message de contact</h1>
            <p><strong>Name:</strong> ${contactForm.name}</p>
            <p><strong>Email:</strong> ${contactForm.email}</p>
            <p><strong>Subject:</strong> ${contactForm.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${contactForm.message}</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


watch(
    () => skills.value,
    (newSkills) => {
        filteredSkills.value = newSkills;
    },
    { immediate: true }
);

// Setup event listeners and load data on mount
onMounted(() => {
    window.addEventListener('mousemove', updateCursorPosition);
    fetchCollections();

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8 overflow-x-hidden">
        <!-- Custom cursor for interactive elements -->
        <div class="fixed z-50 w-8 h-8 rounded-full bg-indigo-500/20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            :style="{
                left: `${cursorPosition.x}px`,
                top: `${cursorPosition.y}px`,
                transform: `translate(-50%, -50%) scale(${isHoveringInteractive ? 2 : 1})`,
                opacity: isHoveringInteractive ? 1 : 0,
                transition: 'transform 0.3s ease, opacity 0.2s ease'
            }"></div>

        <!-- Animated background elements -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
            <div class="absolute top-0 left-0 w-full h-full bg-radial-gradient opacity-30"></div>
        </div>

        <!-- Floating particles -->
        <div class="particles-container fixed inset-0 pointer-events-none overflow-hidden">
            <div v-for="i in 15" :key="i" class="particle" :style="{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                animationDelay: `${Math.random() * 5}s`
            }"></div>
        </div>

        <!-- Navbar -->
        <nav class="flex justify-between items-center mb-8 md:mb-16 relative z-10">
            <div class="text-2xl font-bold">
                <span class="text-indigo-400">tech</span>Tahirou
            </div>
            <div class="hidden md:flex space-x-8">
                <a href="#" class="hover:text-indigo-400 transition-colors relative group">
                    Accueil
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#projects" class="hover:text-indigo-400 transition-colors relative group">
                    Projets
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#about" class="hover:text-indigo-400 transition-colors relative group">
                    À propos
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#contact" class="hover:text-indigo-400 transition-colors relative group">
                    Contact
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </a>
            </div>
            <button class="md:hidden z-50" @click="isMenuOpen = !isMenuOpen">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <!-- Mobile menu -->
            <div v-if="isMenuOpen"
                class="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-8 text-2xl">
                <button @click="isMenuOpen = false" class="absolute top-8 right-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <a @click="isMenuOpen = false" href="#" class="hover:text-indigo-400 transition-colors">Accueil</a>
                <a @click="isMenuOpen = false" href="#projects"
                    class="hover:text-indigo-400 transition-colors">Projets</a>
                <a @click="isMenuOpen = false" href="#about" class="hover:text-indigo-400 transition-colors">À propos</a>
                <a @click="isMenuOpen = false" href="#contact"
                    class="hover:text-indigo-400 transition-colors">Contact</a>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="mb-16 md:mb-24 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-on-scroll">
                <div class="space-y-6">
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Développeur</span>
                        <br>Logiciel Web/Mobile
                    </h1>
                    <p class="text-gray-400 text-lg md:text-xl max-w-2xl">
                        Je conçois des expériences numériques de pointe qui allient une esthétique époustouflante à une
                        fonctionnalité sans faille.
                        Je transforme des défis complexes en solutions intuitives.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <a href="#projects" @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                            class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-8 py-4 rounded-xl transition-all group hover:shadow-xl hover:shadow-indigo-500/20">
                            <span class="relative z-10 flex items-center">
                                Explorer mes projets
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                            <span
                                class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </a>
                        <a href="#contact" @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                            class="relative overflow-hidden border-2 border-indigo-600 text-indigo-400 px-8 py-4 rounded-xl transition-all group hover:bg-indigo-600 hover:text-white">
                            <span class="relative z-10 flex items-center">
                                Contactez-moi
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </span>
                            <span
                                class="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                        </a>
                    </div>

                    <div class="flex flex-wrap gap-6 pt-4">
                        <div v-if="currentStatus && currentStatus.length > 0" class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            <span class="text-sm text-gray-400">
                                <span class="font-semibold">Statut:</span> {{ currentStatus[0].content }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="relative">

                    <div
                        class="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-600/20 to-pink-600/20 blur-xl">
                    </div>
                    <div
                        class="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-xl">
                    </div>

                    <div
                        class="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-indigo-500/10 transform transition-all duration-500 hover:shadow-indigo-500/20">
                        <div
                            class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 animate-wave">
                        </div>

                        <div class="p-8 md:p-10">
                            <div class="flex flex-col items-center mb-6">
                                <div class="relative">
                                    <div
                                        class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-indigo-600 to-pink-600 p-1">
                                        <img src="/avatar.jpeg" alt="Avatar"
                                            class="w-full h-full rounded-full object-cover border-2 border-gray-800/50">
                                    </div>
                                    <div
                                        class="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-2 border-2 border-gray-800/50">
                                        <div
                                            class="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="text-center mb-8">
                                <h3 class="text-xl md:text-2xl font-bold mb-2">
                                    {{ !!heroCard ? heroCard[0].name : 'Tahirou Laouan M.' }}
                                </h3>
                                <div
                                    class="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 mb-4">
                                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                                    <span class="text-sm font-medium">En poste chez <span class="text-indigo-400">Shin
                                            Agency SAS</span></span>
                                </div>
                                <p class="text-gray-400 max-w-md mx-auto">
                                    {{ !!heroCard ? heroCard[0].description : '' }}
                                </p>
                            </div>

                            <div class="grid grid-cols-3 gap-4 mb-8">
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-indigo-400 mb-1">
                                        {{ !!heroCard ? heroCard[0].yearsExperience : '3' }}+
                                    </div>
                                    <div class="text-xs text-gray-400 uppercase tracking-wider">Années XP</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-pink-400 mb-1">
                                        {{ !!heroCard ? heroCard[0].projectsCompleted : (!!projects ? projects.length : '0') }}
                                    </div>
                                    <div class="text-xs text-gray-400 uppercase tracking-wider">Projets</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
                                        {{ !!heroCard ? heroCard[0].clientSatisfaction : '100' }}%
                                    </div>
                                    <div class="text-xs text-gray-400 uppercase tracking-wider">Satisfaction</div>
                                </div>
                            </div>

                            <div class="text-center">
                                <button
                                    class="relative cursor-pointer overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
                                    <a href="/tahirou_fr_cv.pdf" download class="relative z-10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Consulter mon CV
                                    </a>
                                    <span
                                        class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                </button>
                            </div>
                        </div>

                        <!-- Effet de particules -->
                        <div class="absolute inset-0 overflow-hidden pointer-events-none">
                            <div
                                class="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-indigo-500/30 animate-float-1">
                            </div>
                            <div class="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-pink-500/30 animate-float-2">
                            </div>
                            <div
                                class="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-purple-500/30 animate-float-3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Projects Bento Grid -->
        <section id="projects" class="mb-16 md:mb-24 relative z-10">
            <div class="animate-on-scroll">
                <div class="flex justify-between items-center mb-8 md:mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold">
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                        Projets
                        </span>
                        réalisés
                    </h2>
                    <div class="flex items-center">
                        <span class="text-indigo-400 mr-2 hidden md:block">
                            Tout explorer
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>

                <div v-if="!selectedProject">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="(project, index) in projects" :key="index" @click="selectProject(project)"
                            @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                            :class="[
                                'bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 hover:bg-gray-700/50 cursor-pointer transition-all transform hover:scale-[1.01] group border border-gray-700/50 relative overflow-hidden',
                                (index === 0 || index % 4 === 0) ? 'col-span-1 md:col-span-2 row-span-2 hover:border-indigo-500/30' : 'hover:border-gray-700/50'
                            ]">

                            <!-- Background gradient -->
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>

                            <!-- Image block -->
                            <div :class="[
                                'relative mb-4 overflow-hidden rounded-2xl border border-gray-700/50',
                                (index === 0 || index % 4 === 0) ? 'h-64 md:h-96' : 'h-40'
                            ]">
                                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10">
                                </div>

                                <!-- Badge category -->
                                <div :class="[
                                    'absolute z-20 flex justify-between items-center',
                                    (index === 0 || index % 4 === 0) ? 'bottom-4 left-4 right-4' : 'bottom-2 left-2'
                                ]">
                                    <span
                                        class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-xs px-3 py-1 rounded-full">
                                        {{ project.category }}
                                    </span>
                                    <span v-if="(index === 0 || index % 4 === 0)" class="text-white/80 text-sm">{{
                                        project.date }}</span>
                                </div>

                                <!-- Fixed SVG for all -->
                                <div
                                    class="w-full h-full bg-gradient-to-br from-indigo-900/30 to-gray-800 flex items-center justify-center">
                                    <svg v-if="!project.image" xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-500/30"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <img v-else :src="project.image" alt="Project Image"
                                        class="w-full h-full object-cover rounded-2xl">
                                </div>
                            </div>

                            <!-- Title -->
                            <h3 :class="[
                                'font-bold relative z-10 transition-colors',
                                (index === 0 || index % 4 === 0) ? 'text-xl md:text-2xl lg:text-3xl group-hover:text-indigo-400' : 'text-lg group-hover:text-pink-400'
                            ]">
                                {{ project.title }}
                            </h3>

                            <!-- Short description -->
                            <p class="text-gray-400 text-sm mt-2 relative z-10">{{ project.shortDesc }}</p>

                            <!-- Technologies tags -->
                            <div v-if="project.tech?.length" class="mt-4 flex flex-wrap gap-2 relative z-10">
                                <span v-for="(tech, i) in project.tech" :key="i"
                                    class="bg-gray-700/50 text-xs px-3 py-1 rounded-full border border-gray-600/50">
                                    {{ tech }}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                <div v-else
                    class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 transition-all border border-gray-700/50">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl md:text-3xl font-bold">{{ selectedProject.title }}</h2>
                        <button @click="selectedProject = null" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="bg-gray-700/50 hover:bg-gray-600/50 p-2 rounded-lg transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div class="rounded-2xl overflow-hidden mb-6 border border-gray-700/50">
                                <div
                                    class="w-full h-64 md:h-80 bg-gradient-to-br from-indigo-900/30 to-gray-800 flex items-center justify-center">
                                    <svg v-if="!project.image" xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-500/30"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <img v-else :src="selectedProject.image" alt="Project Image"
                                        class="w-full h-full object-cover rounded-2xl">
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-6">
                                <span v-for="(tech, i) in selectedProject.tech" :key="i"
                                    class="bg-gray-700/50 text-xs px-3 py-1 rounded-full border border-gray-600/50">
                                    {{ tech }}
                                </span>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Category</h4>
                                    <p>{{ selectedProject.category }}</p>
                                </div>
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Date</h4>
                                    <p>{{ selectedProject.date }}</p>
                                </div>
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Client</h4>
                                    <p>{{ selectedProject.client }}</p>
                                </div>
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Role</h4>
                                    <p>{{ selectedProject.role }}</p>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <a :href="selectedProject.liveLink" target="_blank"
                                    @mouseenter="isHoveringInteractive = true"
                                    @mouseleave="isHoveringInteractive = false"
                                    class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg transition-all group hover:shadow-lg hover:shadow-indigo-500/20">
                                    <span class="relative z-10 flex items-center">
                                        Live Preview
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                    <span
                                        class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </a>
                                <a :href="selectedProject.repoLink" target="_blank"
                                    @mouseenter="isHoveringInteractive = true"
                                    @mouseleave="isHoveringInteractive = false"
                                    class="relative overflow-hidden border border-indigo-600 text-indigo-400 px-6 py-3 rounded-lg transition-all group hover:bg-indigo-600 hover:text-white">
                                    <span class="relative z-10 flex items-center">
                                        View Code
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </span>
                                    <span
                                        class="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-xl font-bold mb-4">Project Overview</h3>
                            <p class="text-gray-400 mb-6">{{ selectedProject.description }}</p>

                            <h3 class="text-xl font-bold mb-4">Development Process</h3>
                            <div class="space-y-4">
                                <div v-for="(step, i) in selectedProject.process" :key="i" class="flex">
                                    <div class="mr-4 flex-shrink-0">
                                        <div
                                            class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                                            {{ i + 1 }}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-lg">{{ step.title }}</h4>
                                        <p class="text-gray-400">{{ step.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 class="text-xl font-bold mt-6 mb-4">Challenges & Solutions</h3>
                            <div class="bg-gray-700/50 p-4 rounded-xl mb-6 border border-gray-600/50">
                                <h4 class="font-bold">Challenges</h4>
                                <ul class="list-disc list-inside text-gray-400 mt-2 space-y-1">
                                    <li v-for="(challenge, i) in selectedProject.challenges" :key="i">
                                        {{ challenge.content }}
                                    </li>
                                </ul>
                            </div>
                            <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                <h4 class="font-bold">Solutions</h4>
                                <ul class="list-disc list-inside text-gray-400 mt-2 space-y-1">
                                    <li v-for="(solution, i) in selectedProject.solutions" :key="i">
                                        {{ solution.content }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About & Contact -->
        <section id="about" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-16 relative z-10 h-full">
            <div class="grid lg:gap-0 gap-6 h-full">
                <div class="animate-on-scroll h-full">
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50">
                        <h2 class="text-2xl md:text-3xl font-bold mb-4">
                            <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Parcours</span>
                            Professionnel
                        </h2>
                        <p v-if="abouts && abouts.length > 0" v-html="abouts[0].content" class="text-gray-400 mb-4">
                        </p>
                    </div>
                </div>

                <div class="animate-on-scroll h-full">
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 h-full">
                        <h2 class="text-2xl md:text-3xl font-bold mb-4">
                            <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                                Compétences
                            </span> & Outils
                        </h2>
                        <!-- add search bar -->
                        <div class="mb-4">
                            <input @input="filterSkills" type="text" placeholder="Rechercher une compétence"
                                class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <span class="text-gray-500 text-xs">
                                Tapez ci-dessus pour rechercher une compétence ou un outil
                            </span>
                        </div>
                        <div>
                            <ul v-if="filteredSkills && filteredSkills.length > 0" class="flex flex-wrap items-center justify-around gap-2">
                                <li v-for="skill in filteredSkills" class="block w-max p-2 rounded-full border border-gray-700/50 bg-gray-700/50">
                                    <span>
                                        {{ skill }}
                                    </span>
                                </li>
                            </ul>

                            <p v-else>
                                <span class="text-gray-400">Aucune compétence spécifiée.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="contact" class="animate-on-scroll h-full">
                <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl h-full p-6 border border-gray-700/50">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">
                            Entrons
                        </span> en contact
                    </h2>
                    <p class="text-gray-400 mb-6">
                        Vous avez un projet en tête ou souhaitez discuter d'opportunités potentielles ?
                        N'hésitez pas à me contacter !
                    </p>

                    <form @submit.prevent="sendEmail" class="space-y-4 mb-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-400 mb-1">Nom</label>
                                <input type="text" id="name" v-model="contactForm.name"
                                    class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Votre nom">
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input type="email" id="email" v-model="contactForm.email"
                                    class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Votre email">
                            </div>
                        </div>
                        <div>
                            <label for="subject" class="block text-sm font-medium text-gray-400 mb-1">Sujet</label>
                            <input type="text" id="subject" v-model="contactForm.subject"
                                class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Sujet">
                        </div>
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-400 mb-1">Message</label>
                            <textarea id="message" rows="4" v-model="contactForm.message"
                                class="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Dites-moi tout..."></textarea>
                        </div>
                        <button type="submit" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="w-full cursor-pointer relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-3 rounded-lg transition-all group hover:shadow-lg hover:shadow-indigo-500/20">
                            <span class="relative z-10">
                                Envoyer
                            </span>
                            <span
                                class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>
                    </form>

                    <div class="grid grid-cols-2 gap-4">
                        <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].github : '#'" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false" target="_blank"
                            class="flex items-center justify-center bg-gray-700/50 p-4 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>GitHub</span>
                        </a>
                        <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].linkedin : '#'" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false" target="_blank"
                            class="flex items-center justify-center bg-gray-700/50 p-4 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                            </svg>
                            <span>LinkedIn</span>
                        </a>
                        <a :href="contactInfos && contactInfos?.length > 0 ? 'mailto:' + contactInfos[0].email : '#'" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="flex items-center justify-center col-span-2 bg-gray-700/50 p-4 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Email</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t border-gray-800 pt-8 relative z-10">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="text-lg mb-4 md:mb-0">
                    <span class="text-indigo-400">tech</span>Tahirou
                </div>
                <div class="flex space-x-6">
                    <a href="#" @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                        class="text-gray-400 hover:text-indigo-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a href="#" @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                        class="text-gray-400 hover:text-indigo-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                    </a>
                </div>
            </div>
            <div class="text-center text-gray-500 text-sm mt-6 pb-4">
                © 2025 TechTahirou. All rights reserved.
            </div>
        </footer>
    </div>
</template>