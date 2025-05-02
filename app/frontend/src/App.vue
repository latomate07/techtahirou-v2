<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue';

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
const errors = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
});
const successMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

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

// Send email
const sendEmail = async (e) => {
    e.preventDefault();
    successMessage.value = '';
    errorMessage.value = '';

    if (!validateForm()) return;

    const API_URL = import.meta.env.VITE_API_URL;
    const API_TOKEN = import.meta.env.VITE_API_TOKEN;
    const API_EMAIL_RECEIVER = import.meta.env.VITE_API_EMAIL_RECEIVER;

    try {
        isSubmitting.value = true;
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
                text: `Name: ${contactForm.name}\nEmail: ${contactForm.email}\nSubject: ${contactForm.subject}\nMessage: ${contactForm.message}`,
                html: `
                    <h1>Nouveau message de contact</h1>
                    <p><strong>Name:</strong> ${contactForm.name}</p>
                    <p><strong>Email:</strong> ${contactForm.email}</p>
                    <p><strong>Subject:</strong> ${contactForm.subject}</p>
                    <p>${contactForm.message}</p>
                `,
            }),
        });

        if (!response.ok) throw new Error('Échec de l’envoi du message.');

        successMessage.value = 'Votre message a été envoyé avec succès !';
        contactForm.name = '';
        contactForm.email = '';
        contactForm.subject = '';
        contactForm.message = '';
        setTimeout(() => {
            successMessage.value = '';
        }, 5000);
        isSubmitting.value = false;
    } catch (error) {
        console.error('Erreur:', error);
        errorMessage.value = "Une erreur s'est produite. Veuillez réessayer plus tard.";
        isSubmitting.value = false;
    }
};

// Validate form inputs
const validateForm = () => {
    let isValid = true;
    errors.name = contactForm.name.trim() ? '' : 'Le nom est requis.';
    errors.email = /^\S+@\S+\.\S+$/.test(contactForm.email) ? '' : 'Email invalide.';
    errors.subject = contactForm.subject.trim() ? '' : 'Le sujet est requis.';
    errors.message = contactForm.message.trim() ? '' : 'Le message est requis.';

    for (let key in errors) {
        if (errors[key]) isValid = false;
    }
    return isValid;
};

// ---- pagination « load‑more » ----
const visibleCount      = ref(8);           // 8 cartes au départ
const displayedProjects = computed(() =>
  projects.value.slice(0, visibleCount.value)
);

const loadMore = () => {
  visibleCount.value = Math.min(
    visibleCount.value + 2,
    projects.value.length
  );
};

const isLargeCard = (index) => {
  const row = Math.floor(index / 2);
  return row % 2 === index % 2;
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
    <div
        class="font-['SF_Pro_Display',system-ui,sans-serif] text-neutral-50 bg-black min-h-screen relative overflow-hidden antialiased">
        <!-- Gradient Background -->
        <div class="fixed inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black"></div>
            <div class="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-indigo-900/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-0 w-1/3 h-1/3 bg-pink-900/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-1/4 left-1/4 w-1/4 h-1/4 bg-purple-900/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Noise Texture Overlay -->
        <div class="fixed inset-0 z-0 opacity-30 mix-blend-soft-light"
            style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=');">
        </div>

        <!-- Main Content Container -->
        <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <!-- Navbar -->
            <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/5">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex h-16 items-center justify-between">
                        <div class="flex items-center">
                            <div class="text-lg font-medium tracking-tight">
                                <span
                                    class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">tech</span>Tahirou
                            </div>
                        </div>

                        <!-- Desktop Menu -->
                        <div class="hidden md:block">
                            <div class="flex items-center space-x-8">
                                <a href="#"
                                    class="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium">Accueil</a>
                                <a href="#projects"
                                    class="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium">Projets</a>
                                <a href="#contact"
                                    class="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium">Contact</a>
                                <div
                                    class="flex gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full pl-4 pr-1 py-1">
                                    <div class="flex items-center space-x-6">
                                        <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].github : '#'"
                                            @mouseenter="isHoveringInteractive = true"
                                            @mouseleave="isHoveringInteractive = false"
                                            class="text-gray-400 hover:text-indigo-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </a>
                                        <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].linkedin : '#'"
                                            @mouseenter="isHoveringInteractive = true"
                                            @mouseleave="isHoveringInteractive = false"
                                            class="text-gray-400 hover:text-indigo-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                                            </svg>
                                        </a>
                                    </div>
                                    <a href="/tahirou_fr_cv.pdf" download
                                        class="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-sm font-medium flex items-center">
                                        <span>CV</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile Menu Button -->
                        <div class="md:hidden">
                            <button @click="isMenuOpen = !isMenuOpen"
                                class="flex items-center justify-center p-2 rounded-md text-white">
                                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div v-if="isMenuOpen" class="md:hidden bg-black/95 h-screen backdrop-blur-xl">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#" @click="isMenuOpen = false"
                            class="block px-3 py-4 text-white font-medium border-b border-white/5">Accueil</a>
                        <a href="#projects" @click="isMenuOpen = false"
                            class="block px-3 py-4 text-white font-medium border-b border-white/5">Projets</a>
                        <a href="#about" @click="isMenuOpen = false"
                            class="block px-3 py-4 text-white font-medium border-b border-white/5">Contact</a>
                        <a href="/tahirou_fr_cv.pdf" download @click="isMenuOpen = false"
                            class="flex items-center px-3 py-4 text-white font-medium">
                            <span>Télécharger CV</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </a>
                        <div class="flex px-3 py-4 items-center space-x-6">
                            <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].github : '#'"
                                @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                                class="text-gray-400 hover:text-indigo-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].linkedin : '#'"
                                @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                                class="text-gray-400 hover:text-indigo-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="pt-20 md:pt-32 pb-16 md:pb-20 lg:pb-32">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <!-- Hero Text -->
                    <div class="max-w-2xl">
                        <div
                            class="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-6 border border-white/10">
                            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></span>
                            <span class="text-xs font-medium text-white/80">
                                {{ !!currentStatus ? currentStatus[0].content : 'Disponible pour des projets' }}
                            </span>
                        </div>

                        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-8">
                            <span class="block relative overflow-hidden">
                                <span class="block transform transition-transform">
                                    <span
                                        class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Développeur</span>
                                </span>
                            </span>
                            <span class="block">Logiciel Web/Mobile</span>
                        </h1>

                        <p class="text-white/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
                            Je conçois des expériences numériques de pointe qui allient une esthétique époustouflante à
                            une fonctionnalité sans faille.
                        </p>

                        <div class="flex flex-wrap gap-4">
                            <a href="#projects"
                                class="group relative overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:shadow-xl hover:shadow-white/20">
                                <span class="relative z-10">Explorer mes projets</span>
                                <span
                                    class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                            </a>

                            <a href="#contact"
                                class="group relative overflow-hidden rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/90 transition-all duration-300 hover:text-white">
                                <span class="relative z-10">Contactez-moi</span>
                                <span
                                    class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                            </a>
                        </div>
                    </div>

                    <!-- Hero Card -->
                    <div class="relative">
                        <div class="absolute inset-0 -z-10 animate-pulse-slow">
                            <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl">
                            </div>
                            <div class="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-purple-600/20 blur-3xl">
                            </div>
                        </div>

                        <div
                            class="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-40">
                            </div>

                            <div class="relative z-[90] p-4 md:p-8">
                                <div class="flex flex-col items-center mb-8">
                                    <!-- Profile Image -->
                                    <div class="relative mb-4">
                                        <div
                                            class="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 p-[2px]">
                                            <img src="/avatar.jpeg" alt="Avatar"
                                                class="w-full h-full rounded-full object-cover p-[2px] bg-black">
                                        </div>
                                        <div
                                            class="absolute -bottom-1 -right-1 bg-black/40 rounded-full p-1 backdrop-blur-sm">
                                            <div
                                                class="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                                            </div>
                                        </div>
                                    </div>

                                    <h3 class="text-xl font-medium mb-1">
                                        {{ !!heroCard ? heroCard[0].name : 'Tahirou Laouan M.' }}
                                    </h3>

                                    <div
                                        class="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-3 border border-white/10">
                                        <span class="text-xs font-medium text-white/80">En poste chez <span
                                                class="text-indigo-400">Shin Agency SAS</span></span>
                                    </div>

                                    <p class="text-white/60 text-sm mb-6 text-center">
                                        {{ !!heroCard ? heroCard[0].description : 
                                        'Développeur passionné spécialisé dans la création d\'expériences web et mobiles innovantes.' }}
                                    </p>
                                </div>

                                <div class="grid grid-cols-3 gap-4 mb-8">
                                    <div class="backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div class="text-2xl font-bold text-indigo-400 mb-1">
                                            {{ !!heroCard ? heroCard[0].yearsExperience : '3' }}+
                                        </div>
                                        <div class="text-xs text-white/60 font-medium">Années XP</div>
                                    </div>

                                    <div class="backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div class="text-2xl font-bold text-purple-400 mb-1">
                                            {{ !!heroCard ? heroCard[0].projectsCompleted : (!!projects ? projects.length : '0') }}+
                                        </div>
                                        <div class="text-xs text-white/60 font-medium">Projets</div>
                                    </div>

                                    <div class="backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div class="text-2xl font-bold text-pink-400 mb-1">
                                            {{ !!heroCard ? heroCard[0].clientSatisfaction : '100' }}%
                                        </div>
                                        <div class="text-xs text-white/60 font-medium">Satisfaction</div>
                                    </div>
                                </div>

                                <a href="/tahirou_fr_cv.pdf" download
                                    class="w-full inline-flex items-center relative z-[90] justify-center px-6 py-3 border border-white/10 rounded-full text-sm font-medium text-white/90 hover:bg-white/10 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Télécharger mon CV
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tech Stack Section -->
            <section class="py-16">
                <div class="flex flex-col items-center mb-12">
                    <div
                        class="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 border border-white/10">
                        <span class="text-xs font-medium text-white/80">Technologies</span>
                    </div>
                    <h2 class="text-3xl font-bold text-center mb-2">Stack technologique</h2>
                    <p class="text-white/60 text-lg text-center max-w-xl">Une sélection des technologies que j'utilise
                        quotidiennement</p>
                </div>

                <div class="flex flex-wrap justify-center gap-4 md:gap-6">
                    <div v-for="skill in skills" :key="skill"
                        class="group py-4 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 shadow-lg">
                        <span class="text-sm font-medium group-hover:text-indigo-400 transition-colors">{{ skill
                            }}</span>
                    </div>
                </div>
            </section>

            <!-- Projects Section -->
            <section id="projects" class="py-16">
                <div class="flex flex-col items-center mb-12">
                    <div
                        class="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 border border-white/10">
                        <span class="text-xs font-medium text-white/80">Portfolio</span>
                    </div>
                    <h2 class="text-3xl font-bold text-center mb-2">Projets sélectionnés</h2>
                    <p class="text-white/60 text-lg text-center max-w-xl">Une collection de mes travaux les plus récents
                        et significatifs</p>
                </div>

                <div v-if="!selectedProject">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(project, index) in displayedProjects" :key="index" @click="selectProject(project)"
                            class="group relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:bg-white/10 hover:scale-[1.01] cursor-pointer"
                            :class="{ 'lg:col-span-2': isLargeCard(index) }">

                            <div
                                class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            </div>

                            <!-- Project Image -->
                            <div class="h-56 md:h-64 overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>

                                <div
                                    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-black/80 to-gray-800/80">
                                    <svg v-if="!project.image" xmlns="http://www.w3.org/2000/svg"
                                        class="h-16 w-16 text-white/20" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <img v-else :src="project.image" alt="Project Image"
                                        class="w-full h-full object-cover">
                                </div>

                                <!-- Category Badge -->
                                <div class="absolute bottom-4 left-4 z-20">
                                    <span
                                        class="bg-white/10 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10">
                                        {{ project.category }}
                                    </span>
                                </div>
                            </div>

                            <div class="p-6">
                                <h3 class="text-xl font-medium mb-2 group-hover:text-indigo-400 transition-colors">{{
                                    project.title }}</h3>
                                <p class="text-white/60 text-sm mb-4">{{ project.shortDesc }}</p>

                                <!-- Technologies -->
                                <div v-if="project.tech?.length" class="flex flex-wrap gap-2">
                                    <span v-for="(tech, i) in project.tech.slice(0, 3)" :key="i"
                                        class="text-xs text-white/60">
                                        {{ tech.content }}{{ i < Math.min(project.tech.length, 3) - 1 ? ' • ' : '' }}
                                            </span>
                                            <span v-if="project.tech.length > 3" class="text-xs text-white/60">+{{
                                                project.tech.length - 3 }}</span>
                                </div>
                            </div>

                            <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div
                                    class="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <!-- button see more -->
                        <div v-if="visibleCount < projects.length" class="flex justify-center mt-6">
                            <button @click="loadMore"
                                    class="block bg-white/5 w-max mx-auto backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors duration-200 text-sm font-medium flex items-center">
                                Voir plus de projets
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M16.023 9.348h4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Project Detail View -->
                <div v-else
                    class="bg-white/5 backdrop-blur-sm rounded-3xl p-6 transition-all border border-gray-700/50">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl md:text-3xl font-bold">{{ selectedProject.title }}</h2>
                        <button @click="selectedProject = null" @mouseenter="isHoveringInteractive = true"
                            @mouseleave="isHoveringInteractive = false"
                            class="bg-white/15 hover:bg-gray-600/50 p-2 rounded-lg transition-colors border border-gray-600/50">
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
                                    <svg v-if="!selectedProject.image" xmlns="http://www.w3.org/2000/svg"
                                        class="h-16 w-16 text-indigo-500/30" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
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
                                    {{ tech.content }}
                                </span>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                                    <h4 class="text-gray-400 text-sm">Categorie</h4>
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
                                <div class="flex flex-col">
                                    <a :href="selectedProject.liveLink" target="_blank"
                                        @mouseenter="isHoveringInteractive = true"
                                        @mouseleave="isHoveringInteractive = false"
                                        class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg transition-all group hover:shadow-lg hover:shadow-indigo-500/20">
                                        <span class="relative z-10 flex items-center">
                                            Voir en LIVE
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </span>
                                        <span
                                            class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    </a>
                                    <span v-if="!selectedProject.liveLink || selectedProject.liveLink == null"
                                        class="text-xs mt-1">
                                        <span class="text-gray-400">
                                            Lien inaccessible.
                                        </span>
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <a :href="selectedProject.repoLink" target="_blank"
                                        @mouseenter="isHoveringInteractive = true"
                                        @mouseleave="isHoveringInteractive = false"
                                        class="relative overflow-hidden border border-indigo-600 text-indigo-400 px-6 py-3 rounded-lg transition-all group hover:bg-indigo-600 hover:text-white">
                                        <span class="relative z-10 flex items-center">
                                            Voir le code
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </span>
                                        <span
                                            class="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                    </a>
                                    <span v-if="!selectedProject.repoLink || selectedProject.repoLink == null"
                                        class="text-xs mt-1">
                                        <span class="text-gray-400">
                                            Lien inaccessible.
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-xl font-bold mb-4">Présentation du projet</h3>
                            <p class="text-gray-400 mb-6">{{ selectedProject.description }}</p>

                            <h3 class="text-xl font-bold mb-4">Processus de développement</h3>
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

                            <h3 class="text-xl font-bold mt-6 mb-4">Défis et solutions</h3>
                            <div class="bg-gray-700/50 p-4 rounded-xl mb-6 border border-gray-600/50">
                                <h4 class="font-bold">Défis</h4>
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
            </section>

            <!-- Contact Section -->
            <section id="contact" class="py-16">
                <div class="flex flex-col items-center mb-12">
                    <div
                        class="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 border border-white/10">
                        <span class="text-xs font-medium text-white/80">Collaboration</span>
                    </div>
                    <h2 class="text-3xl font-bold text-center mb-2">Travaillons ensemble</h2>
                    <p class="text-white/60 text-lg text-center max-w-xl">
                        Vous avez un projet en tête ou souhaitez discuter d'opportunités potentielles ?
                        N'hésitez pas à me contacter !
                    </p>
                </div>

                <div class="grid">
                    <div
                        class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8">
                        <div class="mb-8">
                            <h3 class="text-2xl font-medium mb-2">Envoyez-moi un message</h3>
                            <p class="text-white/60">Je vous répondrai dans les plus brefs délais</p>
                        </div>

                        <form @submit.prevent="sendEmail" class="space-y-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label for="name" class="block text-sm font-medium text-white/80 mb-2">Nom</label>
                                    <input v-model="contactForm.name" type="text" id="name" name="name" autocomplete="name"
                                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        placeholder="Votre nom">
                                     <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
                                </div>
                                <div>
                                    <label for="email"
                                        class="block text-sm font-medium text-white/80 mb-2">Email</label>
                                    <input v-model="contactForm.email" type="email" id="email" name="email" autocomplete="email"
                                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        placeholder="votre@email.com">
                                    <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
                                </div>
                            </div>

                            <div>
                                <label for="subject" class="block text-sm font-medium text-white/80 mb-2">Sujet</label>
                                <input v-model="contactForm.subject" type="text" id="subject" name="subject"
                                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                    placeholder="Comment puis-je vous aider ?">
                                <p v-if="errors.subject" class="text-red-500 text-sm">{{ errors.subject }}</p>
                            </div>

                            <div>
                                <label for="message"
                                    class="block text-sm font-medium text-white/80 mb-2">Message</label>
                                <textarea v-model="contactForm.message" id="message" name="message" rows="5"
                                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                    placeholder="Décrivez votre projet ou votre demande..."></textarea>
                                <p v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</p>
                            </div>

                            <button type="submit"
                                class="flex cursor-pointer group relative w-max mx-auto justify-center overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:shadow-xl hover:shadow-white/20 w-full">
                                <span class="relative z-10">Envoyer le message</span>
                                <span
                                    class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                            </button>
                            <p v-if="successMessage" class="text-green-500 text-sm text-center mt-1">{{ successMessage }}</p>
                            <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-1">{{ errorMessage }}</p>
                            <p v-if="isSubmitting" class="animate-pulse text-gray-400 text-sm text-center mt-1">Envoi en cours...</p>
                        </form>
                    </div>
                </div>
            </section>
            <!-- Footer -->
            <footer class="border-t border-gray-800 pt-8">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="flex items-center">
                        <div class="text-lg font-medium tracking-tight">
                            <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                tech
                            </span>
                            Tahirou
                        </div>
                    </div>
                    <div class="flex space-x-6">
                        <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].github : '#'"
                            @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                            class="text-gray-400 hover:text-indigo-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a :href="contactInfos && contactInfos?.length > 0 ? contactInfos[0].linkedin : '#'"
                            @mouseenter="isHoveringInteractive = true" @mouseleave="isHoveringInteractive = false"
                            class="text-gray-400 hover:text-indigo-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                viewBox="0 0 24 24">
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
    </div>
</template>