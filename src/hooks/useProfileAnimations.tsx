import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useProfileAnimations = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      const tl = gsap.timeline();

      // Animate header from top
      if (headerRef.current) {
        gsap.set(headerRef.current, { y: -50, opacity: 0 });
        tl.to(headerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        });
      }

      // Animate tabs from bottom
      if (tabsRef.current) {
        gsap.set(tabsRef.current, { y: 30, opacity: 0 });
        tl.to(tabsRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.4");
      }

      // Animate cards with stagger
      if (cardsRef.current.length > 0) {
        gsap.set(cardsRef.current, { y: 40, opacity: 0, scale: 0.95 });
        tl.to(cardsRef.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.3");
      }

      // Background floating animation
      const floatingElements = document.querySelectorAll('.floating-bg');
      floatingElements.forEach((el, index) => {
        gsap.to(el, {
          y: "random(-20, 20)",
          x: "random(-10, 10)",
          rotation: "random(-5, 5)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      });

      // Scroll-triggered animations for balance cards
      const balanceCards = document.querySelectorAll('.balance-card');
      balanceCards.forEach((card) => {
        gsap.fromTo(card, 
          { 
            y: 50,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Transaction list animation
      const transactionRows = document.querySelectorAll('.transaction-row');
      if (transactionRows.length > 0) {
        gsap.fromTo(transactionRows,
          {
            x: -30,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: transactionRows[0],
              start: "top 90%"
            }
          }
        );
      }

    }, profileRef);

    return () => ctx.revert();
  }, []);

  const animateTabChange = (tabElement: HTMLElement) => {
    gsap.fromTo(tabElement, 
      { 
        opacity: 0,
        y: 20,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      }
    );
  };

  const animateCardHover = (card: HTMLElement, isHovering: boolean) => {
    gsap.to(card, {
      scale: isHovering ? 1.02 : 1,
      y: isHovering ? -5 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const animateButtonPress = (button: HTMLElement) => {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    });
  };

  return {
    profileRef,
    headerRef,
    tabsRef,
    addToCardsRef,
    animateTabChange,
    animateCardHover,
    animateButtonPress
  };
};