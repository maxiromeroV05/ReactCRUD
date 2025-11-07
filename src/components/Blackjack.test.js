import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Blackjack from './Blackjack';

// Mock de las imágenes para evitar errores de require
jest.mock('../assets/images/Chip_1.png', () => 'chip1.png');
jest.mock('../assets/images/Chip_5.png', () => 'chip5.png');
jest.mock('../assets/images/Chip_10.png', () => 'chip10.png');
jest.mock('../assets/images/Chip_20.png', () => 'chip20.png');
jest.mock('../assets/images/Chip_50.png', () => 'chip50.png');
jest.mock('../assets/images/Chip_100.png', () => 'chip100.png');
jest.mock('../assets/images/Chip_500.png', () => 'chip500.png');
jest.mock('../assets/images/Chip_1000.png', () => 'chip1000.png');
jest.mock('../assets/images/Chip_5000.png', () => 'chip5000.png');
jest.mock('../assets/images/fondo_mesa.jpg', () => 'fondo_mesa.jpg');

describe('Blackjack Component', () => {
  const mockUser = { username: 'testUser' };

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  // PRUEBA 1: Renderizado inicial del componente
  test('debe renderizar el componente Blackjack con todos los elementos básicos', () => {
    render(<Blackjack currentUser={mockUser} />);
    
    // Verificar que se renderizan elementos clave
    expect(screen.getByText(/CRUPIER/i)).toBeInTheDocument();
    expect(screen.getByText(/JUGADOR/i)).toBeInTheDocument();
    expect(screen.getByText(/Saldo/i)).toBeInTheDocument();
    expect(screen.getByText(/Apuesta/i)).toBeInTheDocument();
    expect(screen.getByText(/Repartir/i)).toBeInTheDocument();
    
    // Verificar botones de acción
    expect(screen.getByText(/Pedir/i)).toBeInTheDocument();
    expect(screen.getByText(/Plantarse/i)).toBeInTheDocument();
    expect(screen.getByText(/Doblar/i)).toBeInTheDocument();
    expect(screen.getByText(/Dividir/i)).toBeInTheDocument();
  });

  // PRUEBA 2: Sistema de apuesta acumulativa con fichas
  test('debe acumular apuestas al hacer click en múltiples fichas', () => {
    render(<Blackjack currentUser={mockUser} />);
    
    // Obtener el input de apuesta
    const apuestaInput = screen.getByDisplayValue('0');
    
    // Hacer click en ficha de 100
    const chip100Buttons = screen.getAllByAltText('Ficha 100');
    fireEvent.click(chip100Buttons[0]);
    
    // Verificar que la apuesta se actualizó
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    
    // Hacer click en ficha de 50
    const chip50Buttons = screen.getAllByAltText('Ficha 50');
    fireEvent.click(chip50Buttons[0]);
    
    // Verificar que se sumó (100 + 50 = 150)
    expect(screen.getByDisplayValue('150')).toBeInTheDocument();
    
    // Hacer otro click en 100
    fireEvent.click(chip100Buttons[0]);
    
    // Verificar suma total (150 + 100 = 250)
    expect(screen.getByDisplayValue('250')).toBeInTheDocument();
  });

  // PRUEBA 3: Bloqueo del botón Repartir hasta seleccionar ficha
  test('el botón Repartir debe estar deshabilitado hasta seleccionar una ficha', () => {
    render(<Blackjack currentUser={mockUser} />);
    
    const repartirButton = screen.getByText(/Repartir/i);
    
    // Inicialmente debe estar deshabilitado
    expect(repartirButton).toBeDisabled();
    
    // Seleccionar una ficha
    const chip100Buttons = screen.getAllByAltText('Ficha 100');
    fireEvent.click(chip100Buttons[0]);
    
    // Ahora debe estar habilitado
    expect(repartirButton).not.toBeDisabled();
  });

  // PRUEBA 4: Validación de saldo insuficiente al seleccionar fichas
  test('debe mostrar advertencia al intentar apostar más del saldo disponible', () => {
    render(<Blackjack currentUser={mockUser} />);
    
    // El saldo inicial es 10000
    // Intentar agregar fichas de 5000 tres veces (total 15000 > 10000)
    const chip5000Buttons = screen.getAllByAltText('Ficha 5000');
    
    // Primera ficha (5000) - debe funcionar
    fireEvent.click(chip5000Buttons[0]);
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    
    // Segunda ficha (10000 total) - debe funcionar
    fireEvent.click(chip5000Buttons[0]);
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    
    // Tercera ficha (15000 total) - debe mostrar error
    fireEvent.click(chip5000Buttons[0]);
    
    // La apuesta no debe cambiar
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    
    // Debe aparecer mensaje de error
    expect(screen.getByText(/Saldo insuficiente/i)).toBeInTheDocument();
  });

  // PRUEBA 5: Botones de acción deshabilitados en estado idle
  test('los botones Pedir, Plantarse, Doblar y Dividir deben estar deshabilitados en estado idle', () => {
    render(<Blackjack currentUser={mockUser} />);
    
    const pedirButton = screen.getByText(/Pedir/i);
    const plantarseButton = screen.getByText(/Plantarse/i);
    const doblarButton = screen.getByText(/Doblar/i);
    const dividirButton = screen.getByText(/Dividir/i);
    
    // Todos deben estar deshabilitados inicialmente
    expect(pedirButton).toBeDisabled();
    expect(plantarseButton).toBeDisabled();
    expect(doblarButton).toBeDisabled();
    expect(dividirButton).toBeDisabled();
  });

  // PRUEBA 6: Persistencia de saldo por usuario en localStorage
  test('debe guardar y cargar el saldo específico del usuario desde localStorage', () => {
    const user1 = { username: 'user1' };
    const user2 = { username: 'user2' };
    
    // Renderizar con user1
    const { rerender } = render(<Blackjack currentUser={user1} />);
    
    // Verificar saldo inicial de user1
    expect(screen.getByText('$10000')).toBeInTheDocument();
    
    // Simular cambio de saldo para user1 (guardado en localStorage)
    localStorage.setItem('saldo_user1', '5000');
    
    // Re-renderizar para forzar recarga
    rerender(<Blackjack currentUser={user1} />);
    
    // Renderizar con user2 (debería tener saldo inicial propio)
    rerender(<Blackjack currentUser={user2} />);
    expect(screen.getByText('$10000')).toBeInTheDocument();
    
    // Volver a user1 (debe recuperar su saldo guardado)
    rerender(<Blackjack currentUser={user1} />);
    expect(screen.getByText('$5000')).toBeInTheDocument();
  });

  // PRUEBA 7: Reset de apuesta después de cada ronda
  test('debe reiniciar la apuesta a 0 después de terminar una ronda', async () => {
    render(<Blackjack currentUser={mockUser} />);
    
    // Seleccionar ficha y apostar
    const chip100Buttons = screen.getAllByAltText('Ficha 100');
    fireEvent.click(chip100Buttons[0]);
    
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    
    // Iniciar ronda
    const repartirButton = screen.getByText(/Repartir/i);
    fireEvent.click(repartirButton);
    
    // Esperar a que termine la ronda (puede ser por blackjack natural)
    // La apuesta debería resetearse a 0
    await waitFor(() => {
      const inputs = screen.queryAllByDisplayValue('0');
      expect(inputs.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});
