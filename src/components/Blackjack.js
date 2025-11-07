import React, { useEffect, useState } from 'react';
import fondoMesa from '../assets/images/fondo_mesa.jpg';

// Importar imágenes de fichas
import chip1 from '../assets/images/Chip_1.png';
import chip5 from '../assets/images/Chip_5.png';
import chip10 from '../assets/images/Chip_10.png';
import chip20 from '../assets/images/Chip_20.png';
import chip50 from '../assets/images/Chip_50.png';
import chip100 from '../assets/images/Chip_100.png';
import chip500 from '../assets/images/Chip_500.png';
import chip1000 from '../assets/images/Chip_1000.png';
import chip5000 from '../assets/images/Chip_5000.png';

// Utilidades básicas de Blackjack
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function buildDeck() {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      let value = 0;
      if (r === 'A') value = 11; // tratamos As como 11 y ajustamos luego
      else if (['J', 'Q', 'K'].includes(r)) value = 10;
      else value = Number(r);
      deck.push({ rank: r, suit: s, value });
    }
  }
  return deck;
}

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function scoreHand(hand) {
  // Suma con Ases flexibles (11 o 1)
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    total += c.value;
    if (c.rank === 'A') aces += 1;
  }
  while (total > 21 && aces > 0) {
    total -= 10; // un As pasa de 11 a 1
    aces -= 1;
  }
  return total;
}

export default function Blackjack({ currentUser }) {
  // Dinero y apuesta
  // Obtener clave única por usuario (si no hay usuario, usar invitado)
  const userKey = currentUser && currentUser.username ? currentUser.username : 'invitado';
  const storageKey = `saldo_${userKey}`;
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? Number(saved) : 10000; // saldo inicial por usuario
  });
  const [bet, setBet] = useState(100);
  const [gananciaVisual, setGananciaVisual] = useState(null); // Para mostrar +$ animado
  const [perdidaVisual, setPerdidaVisual] = useState(null); // Para mostrar -$ animado

  // Mazo y manos
  const [deck, setDeck] = useState(() => shuffle(buildDeck()));
  const [playerHands, setPlayerHands] = useState([]); // array de manos
  const [dealerHand, setDealerHand] = useState([]);
  const [active, setActive] = useState(0); // mano activa
  const [bets, setBets] = useState([]); // apuesta por mano (para split/doblar)
  const [handResults, setHandResults] = useState([]); // resultados por mano
  const [dealerStatus, setDealerStatus] = useState(''); // 'bust' | 'blackjack' | ''
  const [chipSelected, setChipSelected] = useState(false); // requiere seleccionar ficha antes de repartir

  // Estado juego
  const [phase, setPhase] = useState('idle'); // 'idle' | 'player' | 'dealer' | 'roundOver'
  const [message, setMessage] = useState('');

  // Guardar el saldo cada vez que cambia para este usuario
  useEffect(() => {
    localStorage.setItem(storageKey, String(balance));
  }, [balance, storageKey]);

  // Si cambia el usuario (prop), recargar su saldo específico
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setBalance(saved ? Number(saved) : 10000);
  }, [storageKey]);

  const canSplit = () => {
    if (phase !== 'player') return false;
    if (!playerHands[active]) return false;
    const hand = playerHands[active];
    // Solo se puede dividir si:
    // 1. Es la primera mano (no permitir split después de split)
    // 2. Tiene exactamente 2 cartas
    // 3. Ambas cartas tienen el mismo valor
    // 4. Hay saldo suficiente
    if (hand.length !== 2) return false;
    if (playerHands.length !== 1) return false; // solo permitir un split
    if (hand[0].rank !== hand[1].rank) return false;
    if (balance < bet) return false;
    return true;
  };

  const canDouble = () => {
    if (phase !== 'player') return false;
    const hand = playerHands[active];
    if (!hand || hand.length !== 2) return false;
    // Verificar que hay saldo suficiente para doblar la apuesta de esta mano
    const currentBet = bets[active] || bet;
    if (balance < currentBet) return false;
    return true;
  };
  const startRound = () => {
    if (!chipSelected) {
      setMessage('⚠️ Selecciona una ficha para habilitar Repartir');
      return;
    }
    if (bet < 100) {
      setMessage('⚠️ La apuesta mínima es $100');
      return;
    }
    if (bet > balance) {
      setMessage('⚠️ No tienes suficiente saldo para esa apuesta');
      return;
    }
    
  setMessage('');
  // limpiar indicadores de resultados previos
  setHandResults([]);
  setDealerStatus('');
    setBalance((b) => b - bet);

    // Preparar mazo si es necesario
    let currentDeck = deck.length < 15 ? shuffle(buildDeck()) : deck.slice();
    
    // Repartir 2 cartas al jugador y 2 al crupier
    const playerCard1 = currentDeck.pop();
    const playerCard2 = currentDeck.pop();
    const dealerCard1 = currentDeck.pop();
    const dealerCard2 = currentDeck.pop();
    
    const h1 = [playerCard1, playerCard2];
    const d1 = [dealerCard1, dealerCard2];
    
    setDeck(currentDeck);
    setPlayerHands([h1]);
    setDealerHand(d1);
    setActive(0);
    setBets([bet]);
    setPhase('player');

    // Verificar blackjack natural
    const pTotal = scoreHand(h1);
    const dTotal = scoreHand(d1);
    
    if (pTotal === 21 || dTotal === 21) {
      // Alguno tiene Blackjack
      if (pTotal === 21 && dTotal === 21) {
        setMessage('🤝 Empate - Ambos tienen Blackjack. Se devuelve tu apuesta de $' + bet);
        setBalance((b) => b + bet); // devolver apuesta
        setHandResults(['push']);
        setDealerStatus('blackjack');
        setBet(0);
        setChipSelected(false);
        setPhase('roundOver');
      } else if (pTotal === 21) {
        // Solo el jugador tiene Blackjack - Paga 3:2
        const ganancia = Math.floor(bet * 1.5);
        setMessage(`🎉 ¡BLACKJACK! Ganas $${ganancia} (pago 3:2) 🎊`);
        setBalance((b) => b + bet + ganancia);
        setGananciaVisual(ganancia);
        setTimeout(() => setGananciaVisual(null), 3000);
        setHandResults(['blackjack']);
        setDealerStatus('');
        setBet(0);
        setChipSelected(false);
        setPhase('roundOver');
      } else {
        // Solo el crupier tiene Blackjack - jugador pierde
        setMessage(`😔 El crupier tiene Blackjack. Pierdes $${bet}`);
        setPerdidaVisual(bet);
        setTimeout(() => setPerdidaVisual(null), 3000);
        setHandResults(['lose']);
        setDealerStatus('blackjack');
        setBet(0);
        setChipSelected(false);
        setPhase('roundOver');
      }
    }
  };

  const hit = () => {
    if (phase !== 'player') return;
    
    // Robar carta del mazo
    let currentDeck = deck.slice();
    if (currentDeck.length === 0) {
      currentDeck = shuffle(buildDeck());
    }
    const newCard = currentDeck.pop();
    setDeck(currentDeck);
    
    // Agregar carta a la mano activa
    setPlayerHands((ph) => {
      const copy = ph.map((h) => h.slice());
      copy[active].push(newCard);
      const total = scoreHand(copy[active]);
      
      // Si se pasa, avanzar automáticamente
      if (total > 21) {
        setTimeout(() => {
          if (active + 1 < copy.length) {
            setActive(active + 1);
          } else {
            performDealerTurn();
          }
        }, 300);
      }
      return copy;
    });
  };

  const stand = () => {
    if (phase !== 'player') return;
    if (active + 1 < playerHands.length) {
      setActive(active + 1);
    } else {
      performDealerTurn();
    }
  };

  const performDealerTurn = () => {
    setPhase('dealer');
    
    setTimeout(() => {
      // Robar cartas hasta llegar a 17+
      let currentDeck = deck.slice();
      let d = dealerHand.slice();
      
      while (scoreHand(d) < 17) {
        if (currentDeck.length === 0) {
          currentDeck = shuffle(buildDeck());
        }
        const newCard = currentDeck.pop();
        d.push(newCard);
      }
      
      setDeck(currentDeck);
      setDealerHand(d);
      
      // Evaluar cada mano del jugador
      const dTotal = scoreHand(d);
      let totalWin = 0;
      let mensajes = [];
      let totalGanado = 0;
      let totalPerdido = 0;
      const outcomes = [];
      
      playerHands.forEach((hand, i) => {
        const pTotal = scoreHand(hand);
        const b = bets[i] || bet;
        
        if (pTotal > 21) {
          mensajes.push(`💥 Mano ${i + 1}: Te pasaste con ${pTotal}`);
          totalPerdido += b;
          outcomes.push('bust');
        } else if (dTotal > 21) {
          const ganancia = b;
          mensajes.push(`🎉 Mano ${i + 1}: ¡Ganas $${ganancia}! (Crupier se pasó con ${dTotal})`);
          totalWin += b * 2; // recuperar apuesta + ganancia
          totalGanado += ganancia;
          outcomes.push('win');
        } else if (pTotal > dTotal) {
          const ganancia = b;
          mensajes.push(`✅ Mano ${i + 1}: ¡Ganas $${ganancia}! (${pTotal} vs ${dTotal})`);
          totalWin += b * 2; // recuperar apuesta + ganancia
          totalGanado += ganancia;
          outcomes.push('win');
        } else if (pTotal === dTotal) {
          mensajes.push(`🤝 Mano ${i + 1}: Empate (${pTotal}) - Se devuelve apuesta de $${b}`);
          totalWin += b; // devolver apuesta
          outcomes.push('push');
        } else {
          mensajes.push(`❌ Mano ${i + 1}: Pierdes $${b} (${pTotal} vs ${dTotal})`);
          totalPerdido += b;
          outcomes.push('lose');
        }
      });
      
      // Resumen final
      let resumen = '';
      if (totalGanado > 0 && totalPerdido > 0) {
        const neto = totalGanado - totalPerdido;
        resumen = neto > 0 ? ` 💰 Balance: +$${neto}` : ` Balance: -$${Math.abs(neto)}`;
      } else if (totalGanado > 0) {
        resumen = ` 💰 Total ganado: $${totalGanado}`;
      } else if (totalPerdido > 0) {
        resumen = ` Total perdido: $${totalPerdido}`;
      }
      
      if (totalWin > 0) setBalance((bal) => bal + totalWin);
      
      // Mostrar ganancia o pérdida visual
      if (totalGanado > 0) {
        setGananciaVisual(totalGanado);
        setTimeout(() => setGananciaVisual(null), 3000);
      } else if (totalPerdido > 0) {
        setPerdidaVisual(totalPerdido);
        setTimeout(() => setPerdidaVisual(null), 3000);
      }
      
      // Establecer resultados por mano y estado del crupier
      setHandResults(outcomes);
      setDealerStatus(dTotal > 21 ? 'bust' : '');
      
      setMessage(mensajes.join(' | ') + resumen);
      // Reiniciar apuesta para la próxima ronda
      setBet(0);
      setChipSelected(false);
      setPhase('roundOver');
    }, 500);
  };

  const doubleDown = () => {
    if (!canDouble()) {
      if (balance < bets[active]) {
        setMessage('⚠️ No tienes suficiente saldo para doblar');
      }
      return;
    }
    const currentBet = bets[active];
    
    setBalance((b) => b - currentBet);
    setBets((arr) => {
      const copy = arr.slice();
      copy[active] = copy[active] * 2;
      return copy;
    });
    
    // Robar carta del mazo
    let currentDeck = deck.slice();
    if (currentDeck.length === 0) {
      currentDeck = shuffle(buildDeck());
    }
    const newCard = currentDeck.pop();
    setDeck(currentDeck);
    
    // Agregar carta a la mano activa
    setPlayerHands((ph) => {
      const copy = ph.map((h) => h.slice());
      copy[active].push(newCard);
      return copy;
    });
    
    setMessage('');
    // Auto-plantarse después de doblar
    setTimeout(() => {
      if (active + 1 < playerHands.length) {
        setActive(active + 1);
      } else {
        performDealerTurn();
      }
    }, 500);
  };

  const split = () => {
    if (!canSplit()) {
      if (balance < bet) {
        setMessage('⚠️ No tienes suficiente saldo para dividir');
      }
      return;
    }
    
    const hand = playerHands[active];
    const c1 = hand[0];
    const c2 = hand[1];
    
    // Robar cartas del mazo
    let currentDeck = deck.slice();
    if (currentDeck.length < 2) {
      currentDeck = shuffle(buildDeck());
    }
    const extraCard1 = currentDeck.pop();
    const extraCard2 = currentDeck.pop();
    setDeck(currentDeck);
    
    // Crear dos nuevas manos con una carta extra cada una
    const newHands = [[c1, extraCard1], [c2, extraCard2]];
    const newBets = [bets[active], bet];
    
    setPlayerHands(newHands);
    setBets(newBets);
    setBalance((b) => b - bet);
    setMessage('');
  };

  const dealerVisible = phase !== 'player';
  const canDeal = phase === 'idle' && chipSelected;
  const chipsDisabled = phase !== 'idle';

  // Helper para generar ruta de imagen de carta
  const getCardImage = (card) => {
    // formato: AS.png, 2C.png, JD.png, etc.
    const valorMap = {
      'A': 'A', '2': '2', '3': '3', '4': '4', '5': '5',
      '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
      'J': 'J', 'Q': 'Q', 'K': 'K'
    };
    const paloMap = {
      '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C'
    };
    const fileName = `${valorMap[card.rank]}${paloMap[card.suit]}.png`;
    try {
      return require(`../assets/images/${fileName}`);
    } catch (err) {
      console.error(`No se pudo cargar la imagen: ${fileName}`, err);
      return null;
    }
  };

  return (
    <div className="blackjack" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
  padding: '0 20px',
  marginTop: '-55px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      
      {/* Mesa de juego con cartas DENTRO */}
      <div 
        className="mesa" 
        style={{ 
          backgroundImage: `url(${fondoMesa})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          width: '100%',
          maxWidth: '950px',
          height: '480px',
          margin: '0 auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 60px'
        }}
      >
        {/* Reglas en la parte superior - DENTRO de la mesa */}
        <div style={{ 
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(250, 204, 21, 0.9)',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          El Blackjack paga 3 a 2
        </div>

        {/* CRUPIER - Parte superior de la mesa */}
        <div style={{ 
          position: 'absolute',
          top: '55px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            margin: '0 0 8px 0',
            color: '#facc15',
            textShadow: '0 2px 4px rgba(0,0,0,0.7)',
            fontWeight: 'bold'
          }}>
            CRUPIER
          </h3>
          <div className="mano" style={{ 
            display: 'flex', 
            gap: '6px', 
            justifyContent: 'center', 
            minHeight: '90px', 
            flexWrap: 'wrap',
            marginBottom: '5px'
          }}>
            {dealerHand.map((c, i) => (
              <img
                key={i}
                src={i === 1 && !dealerVisible ? require('../assets/images/back.png') : getCardImage(c)}
                alt={i === 1 && !dealerVisible ? 'Carta oculta' : `${c.rank}${c.suit}`}
                className="Carta repartida"
                style={{ 
                  width: '65px',
                  height: 'auto',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
                }}
              />
            ))}
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: dealerVisible ? '#10b981' : '#9ca3af',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            {dealerVisible ? scoreHand(dealerHand) : (dealerHand.length > 0 ? dealerHand[0].value : '??')}
          </div>

          {/* Badge de estado del crupier */}
          {phase === 'roundOver' && dealerStatus && (
            <div className={`badge ${dealerStatus === 'bust' ? 'badge-bust' : 'badge-blackjack'}`} style={{
              marginTop: '6px'
            }}>
              {dealerStatus === 'bust' ? 'CRUPIER SE PASÓ' : 'CRUPIER BLACKJACK'}
            </div>
          )}
        </div>

        {/* JUGADOR - Parte inferior de la mesa */}
        <div style={{ 
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '700px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            margin: '0 0 8px 0',
            color: '#facc15',
            textShadow: '0 2px 4px rgba(0,0,0,0.7)',
            fontWeight: 'bold'
          }}>
            JUGADOR {playerHands.length > 1 ? `(Mano ${active + 1}/${playerHands.length})` : ''}
          </h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {playerHands.map((hand, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: idx === active && phase === 'player' ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
                  border: idx === active && phase === 'player' ? '3px solid var(--gold)' : '2px solid rgba(255,255,255,0.15)',
                  transition: 'all 0.3s ease',
                  boxShadow: idx === active && phase === 'player' ? '0 0 15px rgba(250, 204, 21, 0.5)' : 'none',
                  position: 'relative'
                }}
              >
                {playerHands.length > 1 && (
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#facc15', 
                    marginBottom: '4px',
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    Mano {idx + 1}
                  </div>
                )}
                {/* Badge de resultado por mano */}
                {phase === 'roundOver' && handResults[idx] && (
                  <div className={`badge ${
                    handResults[idx] === 'win' ? 'badge-win' :
                    handResults[idx] === 'lose' ? 'badge-lose' :
                    handResults[idx] === 'push' ? 'badge-push' :
                    handResults[idx] === 'bust' ? 'badge-bust' :
                    handResults[idx] === 'blackjack' ? 'badge-blackjack' : ''
                  }`} style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}>
                    {handResults[idx] === 'win' ? 'GANA' :
                     handResults[idx] === 'lose' ? 'PIERDE' :
                     handResults[idx] === 'push' ? 'EMPATE' :
                     handResults[idx] === 'bust' ? 'SE PASÓ' :
                     handResults[idx] === 'blackjack' ? 'BLACKJACK' : ''}
                  </div>
                )}
                <div className="mano" style={{ 
                  display: 'flex', 
                  gap: '6px', 
                  justifyContent: 'center', 
                  minHeight: '90px', 
                  flexWrap: 'wrap',
                  marginBottom: '4px'
                }}>
                  {hand.map((c, i) => (
                    <img
                      key={i}
                      src={getCardImage(c)}
                      alt={`${c.rank}${c.suit}`}
                      className="Carta repartida"
                      style={{ 
                        width: '65px',
                        height: 'auto',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: scoreHand(hand) > 21 ? '#ef4444' : '#10b981',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}>
                  {scoreHand(hand)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de Controles de Acción */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'rgba(17, 24, 39, 0.8)',
        padding: '20px',
        borderRadius: '15px',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <button 
          style={{
            background: phase === 'player' ? 'linear-gradient(145deg, #2d3748, #1a202c)' : 'linear-gradient(145deg, #4b5563, #374151)',
            border: '1px solid #4a5568',
            color: phase === 'player' ? '#e2e8f0' : '#9ca3af',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: phase !== 'player' ? 'not-allowed' : 'pointer',
            opacity: phase !== 'player' ? 0.5 : 1,
            transition: 'all 0.3s ease',
            minWidth: '120px',
            boxShadow: phase === 'player' ? '0 4px 10px rgba(0,0,0,0.3)' : 'none'
          }}
          onClick={hit} 
          disabled={phase !== 'player'}
          onMouseEnter={(e) => {
            if (phase === 'player') {
              e.target.style.background = 'linear-gradient(145deg, #3d4758, #2a3040)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(145deg, #2d3748, #1a202c)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          }}
        >
          👆 Pedir
        </button>
        
        <button 
          style={{
            background: phase === 'player' ? 'linear-gradient(145deg, #2d3748, #1a202c)' : 'linear-gradient(145deg, #4b5563, #374151)',
            border: '1px solid #4a5568',
            color: phase === 'player' ? '#e2e8f0' : '#9ca3af',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: phase !== 'player' ? 'not-allowed' : 'pointer',
            opacity: phase !== 'player' ? 0.5 : 1,
            transition: 'all 0.3s ease',
            minWidth: '120px',
            boxShadow: phase === 'player' ? '0 4px 10px rgba(0,0,0,0.3)' : 'none'
          }}
          onClick={stand} 
          disabled={phase !== 'player'}
          onMouseEnter={(e) => {
            if (phase === 'player') {
              e.target.style.background = 'linear-gradient(145deg, #3d4758, #2a3040)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(145deg, #2d3748, #1a202c)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          }}
        >
          ✋ Plantarse
        </button>
        
        <button 
          style={{
            background: canDouble() ? 'linear-gradient(145deg, #2d3748, #1a202c)' : 'linear-gradient(145deg, #4b5563, #374151)',
            border: '1px solid #4a5568',
            color: canDouble() ? '#e2e8f0' : '#9ca3af',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: !canDouble() ? 'not-allowed' : 'pointer',
            opacity: !canDouble() ? 0.5 : 1,
            transition: 'all 0.3s ease',
            minWidth: '120px',
            boxShadow: canDouble() ? '0 4px 10px rgba(0,0,0,0.3)' : 'none'
          }}
          onClick={doubleDown} 
          disabled={!canDouble()}
          onMouseEnter={(e) => {
            if (canDouble()) {
              e.target.style.background = 'linear-gradient(145deg, #3d4758, #2a3040)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(145deg, #2d3748, #1a202c)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          }}
        >
          x2 Doblar
        </button>
        
        <button 
          style={{
            background: canSplit() ? 'linear-gradient(145deg, #2d3748, #1a202c)' : 'linear-gradient(145deg, #4b5563, #374151)',
            border: '1px solid #4a5568',
            color: canSplit() ? '#e2e8f0' : '#9ca3af',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: !canSplit() ? 'not-allowed' : 'pointer',
            opacity: !canSplit() ? 0.5 : 1,
            transition: 'all 0.3s ease',
            minWidth: '120px',
            boxShadow: canSplit() ? '0 4px 10px rgba(0,0,0,0.3)' : 'none'
          }}
          onClick={split} 
          disabled={!canSplit()}
          onMouseEnter={(e) => {
            if (canSplit()) {
              e.target.style.background = 'linear-gradient(145deg, #3d4758, #2a3040)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(145deg, #2d3748, #1a202c)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          }}
        >
          ✂️ Dividir
        </button>
      </div>

      {/* Fichas y controles de apuesta */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'rgba(17, 24, 39, 0.8)',
        padding: '20px',
        borderRadius: '15px',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {/* Fichas */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { valor: 1, img: chip1 },
            { valor: 5, img: chip5 },
            { valor: 10, img: chip10 },
            { valor: 20, img: chip20 },
            { valor: 50, img: chip50 },
            { valor: 100, img: chip100 },
            { valor: 500, img: chip500 },
            { valor: 1000, img: chip1000 },
            { valor: 5000, img: chip5000 }
          ].map(({ valor, img }) => (
            <button
              key={valor}
              onClick={() => {
                if (chipsDisabled || valor > (balance - bet)) return;
                // Si añadir esta ficha excede el saldo, mostrar advertencia
                const nuevoTotal = bet + valor;
                if (nuevoTotal > balance) {
                  setMessage(`⚠️ Saldo insuficiente. Intentas apostar $${nuevoTotal} y solo tienes $${balance}`);
                  return;
                }
                setBet(nuevoTotal);
                setChipSelected(true);
                setMessage('');
              }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                // resaltar si la ficha está incluida (al menos una vez) en la composición actual de la apuesta
                border: bet >= valor && chipSelected ? '3px solid var(--gold)' : '2px solid transparent',
                background: 'transparent',
                cursor: (chipsDisabled || valor > (balance - bet)) ? 'not-allowed' : 'pointer',
                opacity: (chipsDisabled || (valor > (balance - bet) && !(chipSelected && bet >= valor))) ? 0.5 : 1,
                transition: 'all 0.2s ease',
                boxShadow: bet === valor && chipSelected ? '0 0 15px rgba(250, 204, 21, 0.6)' : '0 4px 10px rgba(0,0,0,0.3)',
                padding: '0',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (chipsDisabled || valor > (balance - bet)) return;
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = bet >= valor && chipSelected ? '0 0 20px rgba(250, 204, 21, 0.8)' : '0 6px 15px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                if (chipsDisabled || valor > (balance - bet)) return;
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = bet >= valor && chipSelected ? '0 0 15px rgba(250, 204, 21, 0.6)' : '0 4px 10px rgba(0,0,0,0.3)';
              }}
              disabled={chipsDisabled || valor > (balance - bet)}
              title={chipsDisabled ? '' : (valor > (balance - bet) ? 'Saldo insuficiente' : `Agregar $${valor}`)}
            >
              <img 
                src={img} 
                alt={`Ficha ${valor}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none'
                }}
              />
            </button>
          ))}
        </div>

        {/* Saldo y apuesta */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          color: '#e2e8f0',
          fontSize: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '100px',
            position: 'relative'
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Saldo</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>${balance}</span>
            
            {/* Ganancia animada */}
            {gananciaVisual && (
              <span style={{
                position: 'absolute',
                top: '-15px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#22c55e',
                animation: 'fadeInOut 3s ease-in-out',
                textShadow: '0 2px 8px rgba(34, 197, 94, 0.8)'
              }}>
                +${gananciaVisual}
              </span>
            )}
            
            {/* Pérdida animada */}
            {perdidaVisual && (
              <span style={{
                position: 'absolute',
                top: '-15px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ef4444',
                animation: 'fadeInOut 3s ease-in-out',
                textShadow: '0 2px 8px rgba(239, 68, 68, 0.8)'
              }}>
                -${perdidaVisual}
              </span>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '100px'
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Apuesta</span>
            <input
              type="number"
              min={100}
              step={50}
              value={bet}
              onChange={(e) => setBet(Number(e.target.value) || 0)}
              disabled={phase !== 'idle'}
              style={{
                background: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(75, 85, 99, 0.8)',
                borderRadius: '8px',
                color: bet === 0 ? '#9ca3af' : '#facc15',
                padding: '6px 12px',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '90px'
              }}
            />
            {bet === 0 && phase === 'idle' && (
              <span style={{ marginTop: '6px', fontSize: '12px', color: '#9ca3af' }}>
                Selecciona fichas para apostar
              </span>
            )}
          </div>

          {/* Botón Repartir */}
          <button 
            style={{
              background: canDeal ? 'linear-gradient(145deg, #10b981, #059669)' : 'linear-gradient(145deg, #6b7280, #4b5563)',
              border: 'none',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: canDeal ? 'pointer' : 'not-allowed',
              opacity: canDeal ? 1 : 0.5,
              transition: 'all 0.3s ease',
              boxShadow: canDeal ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
              textTransform: 'uppercase'
            }}
            onClick={startRound} 
            disabled={!canDeal}
            onMouseEnter={(e) => {
              if (canDeal) {
                e.target.style.background = 'linear-gradient(145deg, #059669, #047857)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (canDeal) {
                e.target.style.background = 'linear-gradient(145deg, #10b981, #059669)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
              }
            }}
          >
            Repartir
          </button>
          {phase === 'idle' && !chipSelected && (
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>
              Selecciona una ficha para habilitar Repartir
            </span>
          )}

          {/* Botón Nueva Ronda */}
          {phase === 'roundOver' && (
            <button 
              style={{
                background: 'linear-gradient(145deg, #f59e0b, #d97706)',
                border: 'none',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                textTransform: 'uppercase'
              }}
              onClick={() => {
                setPhase('idle');
                setMessage('');
                setPlayerHands([]);
                setDealerHand([]);
                setActive(0);
                setBets([]);
                setHandResults([]);
                setDealerStatus('');
                setChipSelected(false);
                if (deck.length < 15) setDeck(shuffle(buildDeck()));
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(145deg, #d97706, #b45309)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(145deg, #f59e0b, #d97706)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
              }}
            >
              Nueva Ronda
            </button>
          )}
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`mensaje ${
          message.includes('BLACKJACK') || message.includes('3:2') || message.includes('🎉') ? 'blackjack' :
          message.includes('Gana') || message.includes('pasó') || message.includes('✅') ? 'ganaste' :
          message.includes('Pierde') || message.includes('pasaste') || message.includes('❌') || message.includes('💥') ? 'perdiste' :
          message.includes('Empate') || message.includes('🤝') ? 'empate' : ''
        }`} style={{ 
          marginTop: '-5px', 
          fontSize: '15px', 
          padding: '15px 25px',
          borderRadius: '10px',
          maxWidth: '900px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          lineHeight: '1.5'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
