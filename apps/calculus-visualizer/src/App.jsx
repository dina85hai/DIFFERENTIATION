import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Eye, EyeOff } from 'lucide-react';

const PhysicalCalculusVisualizer = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showPosition, setShowPosition] = useState(true);
  const [showVelocity, setShowVelocity] = useState(true);
  const [showAcceleration, setShowAcceleration] = useState(false);
  const [showTrail, setShowTrail] = useState(true);
  const animationRef = useRef();
  const trailRef = useRef([]);

  const scenarios = [
    {
      title: "🚗 Car on Highway",
      description: "Car accelerating then maintaining speed",
      object: "🚗",
      position: (t) => {
        if (t <= 2) return 5 * t * t; // Accelerating
        if (t <= 6) return 20 + 20 * (t - 2); // Constant speed
        return 100 + 20 * (t - 6) - 2.5 * (t - 6) * (t - 6); // Decelerating
      },
      velocity: (t) => {
        if (t <= 2) return 10 * t;
        if (t <= 6) return 20;
        return 20 - 5 * (t - 6);
      },
      acceleration: (t) => {
        if (t <= 2) return 10;
        if (t <= 6) return 0;
        return -5;
      },
      maxTime: 10,
      positionUnit: "meters",
      velocityUnit: "m/s",
      accelerationUnit: "m/s²",
      color: "#DC2626",
      phases: ["Accelerating", "Cruising", "Braking"]
    },
    {
      title: "⚽ Ball Thrown Up",
      description: "Ball thrown upward against gravity",
      object: "⚽",
      position: (t) => Math.max(0, 30 * t - 5 * t * t),
      velocity: (t) => t > 6 ? 0 : 30 - 10 * t,
      acceleration: (t) => t > 6 ? 0 : -10,
      maxTime: 8,
      positionUnit: "meters",
      velocityUnit: "m/s",
      accelerationUnit: "m/s²",
      color: "#059669",
      phases: ["Rising", "Peak", "Falling"]
    },
    {
      title: "🎢 Roller Coaster",
      description: "Roller coaster going through hills and valleys",
      object: "🎢",
      position: (t) => 20 + 15 * Math.sin(t * 0.8) + 5 * Math.cos(t * 0.4),
      velocity: (t) => 15 * 0.8 * Math.cos(t * 0.8) - 5 * 0.4 * Math.sin(t * 0.4),
      acceleration: (t) => -15 * 0.8 * 0.8 * Math.sin(t * 0.8) - 5 * 0.4 * 0.4 * Math.cos(t * 0.4),
      maxTime: 12,
      positionUnit: "meters",
      velocityUnit: "m/s",
      accelerationUnit: "m/s²",
      color: "#7C3AED",
      phases: ["Up Hill", "Down Hill", "Loop"]
    },
    {
      title: "🚀 Rocket Launch",
      description: "Rocket accelerating upward with increasing thrust",
      object: "🚀",
      position: (t) => 2 * t * t * t + 5 * t * t,
      velocity: (t) => 6 * t * t + 10 * t,
      acceleration: (t) => 12 * t + 10,
      maxTime: 6,
      positionUnit: "km",
      velocityUnit: "km/s",
      accelerationUnit: "km/s²",
      color: "#EA580C",
      phases: ["Liftoff", "Acceleration", "Escape"]
    },
    {
      title: "🌊 Ocean Wave",
      description: "Buoy bobbing on ocean waves",
      object: "🛟",
      position: (t) => 10 + 3 * Math.sin(t * 2) + 1.5 * Math.sin(t * 3),
      velocity: (t) => 3 * 2 * Math.cos(t * 2) + 1.5 * 3 * Math.cos(t * 3),
      acceleration: (t) => -3 * 2 * 2 * Math.sin(t * 2) - 1.5 * 3 * 3 * Math.sin(t * 3),
      maxTime: 8,
      positionUnit: "meters",
      velocityUnit: "m/s",
      accelerationUnit: "m/s²",
      color: "#0EA5E9",
      phases: ["Wave Up", "Wave Peak", "Wave Down"]
    }
  ];

  const currentScenario_data = scenarios[currentScenario];

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setAnimationTime(prev => {
          const next = prev + 0.05 * speed;
          
          // Add to trail
          if (trailRef.current.length > 100) {
            trailRef.current.shift();
          }
          trailRef.current.push({
            time: next,
            position: currentScenario_data.position(next),
            velocity: currentScenario_data.velocity(next),
            acceleration: currentScenario_data.acceleration(next)
          });
          
          return next > currentScenario_data.maxTime ? 0 : next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isAnimating, speed, currentScenario]);

  const resetAnimation = () => {
    setAnimationTime(0);
    setIsAnimating(false);
    trailRef.current = [];
  };

  const generatePath = (func, xMin = 0, xMax = 10, steps = 200, yScale = 2, yOffset = 150) => {
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * i / steps;
      const y = func(x);
      points.push(`${50 + x * 35},${yOffset - y * yScale}`);
    }
    return `M${points.join('L')}`;
  };

  const getObjectPosition = () => {
    const pos = currentScenario_data.position(animationTime);
    return {
      x: 50 + animationTime * 35,
      y: 80 - pos * 0.8 // Visual position on track
    };
  };

  const getCurrentValues = () => {
    return {
      position: currentScenario_data.position(animationTime),
      velocity: currentScenario_data.velocity(animationTime),
      acceleration: currentScenario_data.acceleration(animationTime)
    };
  };

  const getPhase = () => {
    const phases = currentScenario_data.phases;
    const progress = animationTime / currentScenario_data.maxTime;
    const phaseIndex = Math.floor(progress * phases.length);
    return phases[Math.min(phaseIndex, phases.length - 1)];
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🎯 Physical Objects & Rate of Change
        </h1>
        <p className="text-lg text-gray-600">
          Watch real objects move and see how their motion creates mathematical graphs!
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {scenarios.map((scenario, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentScenario(index);
              resetAnimation();
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentScenario === index
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">{scenario.object}</span>
              <span className="text-sm font-medium text-center">{scenario.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Physical Animation Area */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentScenario_data.title}</h2>
          <p className="text-gray-600 mb-2">{currentScenario_data.description}</p>
          <p className="text-sm font-medium text-purple-600">Current Phase: {getPhase()}</p>
        </div>

        {/* Physical Motion Visualization */}
        <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">🏃‍♂️ Object in Motion</h3>
          <svg width="100%" height="120" className="border rounded bg-gradient-to-b from-sky-200 to-green-200">
            {/* Ground/Track */}
            <line x1="0" y1="80" x2="100%" y2="80" stroke="#8B4513" strokeWidth="4"/>
            
            {/* Trail */}
            {showTrail && trailRef.current.map((point, index) => (
              <circle
                key={index}
                cx={50 + point.time * 35}
                cy={80 - point.position * 0.8}
                r="2"
                fill={currentScenario_data.color}
                opacity={0.3 * (index / trailRef.current.length)}
              />
            ))}
            
            {/* Moving Object */}
            <text
              x={getObjectPosition().x}
              y={getObjectPosition().y}
              fontSize="24"
              textAnchor="middle"
              className="select-none"
            >
              {currentScenario_data.object}
            </text>
            
            {/* Velocity Vector */}
            {showVelocity && (
              <line
                x1={getObjectPosition().x}
                y1={getObjectPosition().y}
                x2={getObjectPosition().x + getCurrentValues().velocity * 2}
                y2={getObjectPosition().y}
                stroke="#FF6B35"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
              />
            )}
            
            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#FF6B35" />
              </marker>
            </defs>
          </svg>
          
          {/* Real-time Values */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-white rounded shadow">
              <div className="text-sm text-gray-600">Position</div>
              <div className="text-lg font-bold" style={{color: currentScenario_data.color}}>
                {getCurrentValues().position.toFixed(1)} {currentScenario_data.positionUnit}
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded shadow">
              <div className="text-sm text-gray-600">Velocity (Rate of Change)</div>
              <div className="text-lg font-bold text-orange-600">
                {getCurrentValues().velocity.toFixed(1)} {currentScenario_data.velocityUnit}
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded shadow">
              <div className="text-sm text-gray-600">Acceleration</div>
              <div className="text-lg font-bold text-red-600">
                {getCurrentValues().acceleration.toFixed(1)} {currentScenario_data.accelerationUnit}
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Position Graph */}
          {showPosition && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                📍 Position vs Time
              </h3>
              
              <svg width="100%" height="250" className="border rounded bg-gray-50">
                <defs>
                  <pattern id="grid1" width="35" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 35 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid1)" />
                
                {/* Axes */}
                <line x1="50" y1="0" x2="50" y2="250" stroke="#374151" strokeWidth="2"/>
                <line x1="0" y1="200" x2="100%" y2="200" stroke="#374151" strokeWidth="2"/>
                
                {/* Labels */}
                <text x="90%" y="195" className="text-xs fill-gray-600">Time</text>
                <text x="55" y="15" className="text-xs fill-gray-600">Position</text>
                
                {/* Position curve */}
                <path
                  d={generatePath(currentScenario_data.position, 0, currentScenario_data.maxTime, 200, 3, 200)}
                  fill="none"
                  stroke={currentScenario_data.color}
                  strokeWidth="3"
                />
                
                {/* Current point */}
                <circle
                  cx={50 + animationTime * 35}
                  cy={200 - currentScenario_data.position(animationTime) * 3}
                  r="6"
                  fill={currentScenario_data.color}
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Vertical line to current time */}
                <line
                  x1={50 + animationTime * 35}
                  y1="0"
                  x2={50 + animationTime * 35}
                  y2="250"
                  stroke={currentScenario_data.color}
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              </svg>
            </div>
          )}

          {/* Velocity Graph */}
          {showVelocity && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                🏃 Velocity vs Time (1st Derivative)
              </h3>
              
              <svg width="100%" height="250" className="border rounded bg-gray-50">
                <rect width="100%" height="100%" fill="url(#grid1)" />
                
                {/* Axes */}
                <line x1="50" y1="0" x2="50" y2="250" stroke="#374151" strokeWidth="2"/>
                <line x1="0" y1="125" x2="100%" y2="125" stroke="#374151" strokeWidth="2"/>
                
                {/* Zero line */}
                <line x1="50" y1="125" x2="90%" y2="125" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3"/>
                
                {/* Labels */}
                <text x="90%" y="120" className="text-xs fill-gray-600">Time</text>
                <text x="55" y="15" className="text-xs fill-gray-600">Velocity</text>
                
                {/* Velocity curve */}
                <path
                  d={generatePath(currentScenario_data.velocity, 0, currentScenario_data.maxTime, 200, 4, 125)}
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="3"
                />
                
                {/* Current point */}
                <circle
                  cx={50 + animationTime * 35}
                  cy={125 - currentScenario_data.velocity(animationTime) * 4}
                  r="6"
                  fill="#FF6B35"
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Vertical line */}
                <line
                  x1={50 + animationTime * 35}
                  y1="0"
                  x2={50 + animationTime * 35}
                  y2="250"
                  stroke="#FF6B35"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              </svg>
            </div>
          )}

          {/* Acceleration Graph */}
          {showAcceleration && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                🚀 Acceleration vs Time (2nd Derivative)
              </h3>
              
              <svg width="100%" height="250" className="border rounded bg-gray-50">
                <rect width="100%" height="100%" fill="url(#grid1)" />
                
                {/* Axes */}
                <line x1="50" y1="0" x2="50" y2="250" stroke="#374151" strokeWidth="2"/>
                <line x1="0" y1="125" x2="100%" y2="125" stroke="#374151" strokeWidth="2"/>
                
                {/* Zero line */}
                <line x1="50" y1="125" x2="90%" y2="125" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3"/>
                
                {/* Labels */}
                <text x="90%" y="120" className="text-xs fill-gray-600">Time</text>
                <text x="55" y="15" className="text-xs fill-gray-600">Acceleration</text>
                
                {/* Acceleration curve */}
                <path
                  d={generatePath(currentScenario_data.acceleration, 0, currentScenario_data.maxTime, 200, 8, 125)}
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="3"
                />
                
                {/* Current point */}
                <circle
                  cx={50 + animationTime * 35}
                  cy={125 - currentScenario_data.acceleration(animationTime) * 8}
                  r="6"
                  fill="#DC2626"
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Vertical line */}
                <line
                  x1={50 + animationTime * 35}
                  y1="0"
                  x2={50 + animationTime * 35}
                  y2="250"
                  stroke="#DC2626"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isAnimating ? <Pause size={20} /> : <Play size={20} />}
            {isAnimating ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={resetAnimation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={20} />
            Reset
          </button>
          
          <div className="flex items-center gap-2">
            <Settings size={16} />
            <label className="text-sm">Speed:</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm">{speed}x</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPosition}
              onChange={(e) => setShowPosition(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Position Graph</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showVelocity}
              onChange={(e) => setShowVelocity(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Velocity Graph (1st Derivative)</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAcceleration}
              onChange={(e) => setShowAcceleration(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Acceleration Graph (2nd Derivative)</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showTrail}
              onChange={(e) => setShowTrail(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Motion Trail</span>
          </label>
        </div>
      </div>

      {/* Concept Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-3">📍 Position Function</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>What it shows:</strong> Where the object is at any given time</p>
            <p><strong>Graph meaning:</strong> Height shows distance from starting point</p>
            <p><strong>Slope meaning:</strong> Steeper slope = faster movement</p>
            <p><strong>Real world:</strong> Like tracking a car's odometer reading</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-800 mb-3">🏃 Velocity (1st Derivative)</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>What it shows:</strong> How fast position is changing (speed + direction)</p>
            <p><strong>Graph meaning:</strong> Height shows speed, sign shows direction</p>
            <p><strong>Connection:</strong> Velocity = slope of position graph</p>
            <p><strong>Real world:</strong> Like your car's speedometer</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-800 mb-3">🚀 Acceleration (2nd Derivative)</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>What it shows:</strong> How fast velocity is changing</p>
            <p><strong>Graph meaning:</strong> Height shows rate of speed change</p>
            <p><strong>Connection:</strong> Acceleration = slope of velocity graph</p>
            <p><strong>Real world:</strong> Like pressing the gas pedal</p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-purple-800 mb-4">🎯 Key Insights About Rate of Change</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-purple-700 mb-2">🔍 Visual Connections:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Steep position curve = high velocity</li>
              <li>• Positive velocity = moving forward</li>
              <li>• Negative velocity = moving backward</li>
              <li>• Zero velocity = momentarily stopped</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700 mb-2">📊 Mathematical Relationships:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Velocity is the derivative of position</li>
              <li>• Acceleration is the derivative of velocity</li>
              <li>• Derivatives show instantaneous rates of change</li>
              <li>• The graphs are all connected!</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg">
          <p className="text-center text-gray-600 italic">
            "Watch how the physical motion of the object creates the mathematical curves. The derivative isn't just math - it's the language of motion!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhysicalCalculusVisualizer;