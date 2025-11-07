import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Importar el componente Blackjack
import Blackjack from './Blackjack';

describe('Blackjack Component - Jasmine Tests', () => {
  
  // Test 1: Renderizado del componente y elementos básicos
  it('should render the Blackjack component with initial elements', () => {
    const mockUser = { username: 'testuser' };
    render(<Blackjack currentUser={mockUser} />);
    
    // Verificar que se renderiza el título del crupier
    const crupierElement = screen.getByText(/CRUPIER/i);
    expect(crupierElement).toBeTruthy();
    
    // Verificar que se renderiza el saldo inicial
    const saldoElement = screen.getByText(/Saldo/i);
    expect(saldoElement).toBeTruthy();
    
    // Verificar que se renderiza el botón Repartir (usar getByRole para ser específico)
    const repartirButton = screen.getByRole('button', { name: /Repartir/i });
    expect(repartirButton).toBeTruthy();
    
    // Verificar que las fichas están presentes
    const chipButtons = screen.getAllByRole('button');
    expect(chipButtons.length).toBeGreaterThan(0);
  });

  // Test 2: Selección de fichas y habilitación del botón Repartir
  it('should enable deal button after selecting a chip', () => {
    const mockUser = { username: 'testuser' };
    render(<Blackjack currentUser={mockUser} />);
    
    const repartirButton = screen.getByRole('button', { name: /Repartir/i });
    
    // Inicialmente el botón debe estar deshabilitado
    expect(repartirButton.disabled).toBe(true);
    
    // Buscar y clickear una ficha (por ejemplo, la de 100)
    const allButtons = screen.getAllByRole('button');
    const chipButton = allButtons.find(btn => {
      const img = btn.querySelector('img');
      return img && img.alt.includes('100');
    });
    
    if (chipButton) {
      fireEvent.click(chipButton);
      
      // Ahora el botón Repartir debe estar habilitado
      expect(repartirButton.disabled).toBe(false);
    }
  });

  // Test 3: Acumulación de apuesta al hacer clic múltiple en fichas
  it('should accumulate bet when clicking multiple chips', () => {
    const mockUser = { username: 'testuser' };
    
    // Mockear localStorage para tener saldo suficiente
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function(key) {
      if (key === 'saldo_testuser') return '10000';
      return null;
    };
    
    render(<Blackjack currentUser={mockUser} />);
    
    // Buscar el input de apuesta
    const apuestaInput = screen.getByRole('spinbutton');
    
    // Valor inicial debe ser 100 (valor por defecto)
    expect(apuestaInput.value).toBe('100');
    
    // Clickear fichas diferentes
    const allButtons = screen.getAllByRole('button');
    
    // Buscar ficha de 100
    const chip100 = allButtons.find(btn => {
      const img = btn.querySelector('img');
      return img && img.alt.includes('100');
    });
    
    // Buscar ficha de 50
    const chip50 = allButtons.find(btn => {
      const img = btn.querySelector('img');
      return img && img.alt.includes('50');
    });
    
    if (chip100 && chip50) {
      fireEvent.click(chip100);
      // Ahora debe ser 100 (inicial) + 100 = 200
      expect(apuestaInput.value).toBe('200');
      
      fireEvent.click(chip50);
      // Ahora debe ser 200 + 50 = 250
      expect(apuestaInput.value).toBe('250');
    }
    
    // Restaurar localStorage
    Storage.prototype.getItem = originalGetItem;
  });

  // Test 4: Inicio de ronda con cartas repartidas
  it('should deal cards when clicking Repartir button after selecting chip', async () => {
    const mockUser = { username: 'testuser' };
    render(<Blackjack currentUser={mockUser} />);
    
    // Seleccionar una ficha
    const allButtons = screen.getAllByRole('button');
    const chip100 = allButtons.find(btn => {
      const img = btn.querySelector('img');
      return img && img.alt.includes('100');
    });
    
    if (chip100) {
      fireEvent.click(chip100);
      
      // Clickear Repartir
      const repartirButton = screen.getByRole('button', { name: /Repartir/i });
      fireEvent.click(repartirButton);
      
      // Esperar a que se repartan las cartas
      await waitFor(() => {
        const allImages = screen.getAllByRole('img');
        const cardImages = allImages.filter(img => 
          img.alt && /[A-K0-9][♠♥♦♣]/.test(img.alt)
        );
        // Debe haber al menos 2 cartas visibles
        expect(cardImages.length).toBeGreaterThanOrEqual(2);
      }, { timeout: 1000 });
    }
  });

  // Test 5: Validación de fichas deshabilitadas cuando el saldo es insuficiente
  it('should disable chips when balance is insufficient', () => {
    const mockUser = { username: 'testuser' };
    
    // Mockear localStorage para simular saldo bajo (300)
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;
    
    Storage.prototype.getItem = function(key) {
      if (key === 'saldo_testuser') return '300';
      return null;
    };
    
    Storage.prototype.setItem = function() {};
    
    render(<Blackjack currentUser={mockUser} />);
    
    // El componente inicia con bet=100, balance=300
    // Disponible para apostar: 300 - 100 = 200
    
    // Buscar fichas que exceden el saldo disponible (500 y 1000)
    const allButtons = screen.getAllByRole('button');
    const chip500 = allButtons.find(btn => {
      const img = btn.querySelector('img');
      return img && img.alt.includes('500');
    });
    
    if (chip500) {
      // La ficha de 500 debería estar deshabilitada visualmente (opacity: 0.3)
      const chip500Style = window.getComputedStyle(chip500);
      // Verificar que la opacidad sea 0.5 o menos (deshabilitada)
      expect(parseFloat(chip500Style.opacity)).toBeLessThanOrEqual(0.5);
    }
    
    // Restaurar localStorage
    Storage.prototype.getItem = originalGetItem;
    Storage.prototype.setItem = originalSetItem;
  });

  // Test 6: Botones de acción (Pedir, Plantarse, etc.) habilitados durante el turno del jugador
  it('should enable action buttons during player turn', async () => {
    const mockUser = { username: 'testuser' };
    render(<Blackjack currentUser={mockUser} />);
    
    // Seleccionar ficha y repartir
    const allButtons = screen.getAllByRole('button');
    const chip100 = allButtons.find(btn => {
      const img = btn.querySelector('img');
      return img && img.alt.includes('100');
    });
    
    if (chip100) {
      fireEvent.click(chip100);
      
      const repartirButton = screen.getByRole('button', { name: /Repartir/i });
      fireEvent.click(repartirButton);
      
      // Esperar a que comience el turno del jugador
      await waitFor(() => {
        const pedirButton = screen.getByRole('button', { name: /Pedir/i });
        expect(pedirButton.disabled).toBe(false);
        
        const plantarseButton = screen.getByRole('button', { name: /Plantarse/i });
        expect(plantarseButton.disabled).toBe(false);
      }, { timeout: 1000 });
    }
  });

});
