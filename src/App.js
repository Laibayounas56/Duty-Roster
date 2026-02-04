import React, { useState, useEffect } from 'react';
import RoomsManager from './components/RoomsManager';
import SlotsManager from './components/SlotsManager';
import PeopleManager from './components/PeopleManager';
import ReviewPanel from './components/ReviewPanel';
import RosterView from './components/RosterView';
import PDFExportButton from './pdf/PDFExport';
import SuccessNotification from './components/SuccessNotification';
import { generateRoster } from './logic/generateRoster';
import {
  loadRooms, saveRooms,
  loadSlots, saveSlots,
  loadSlotRooms, saveSlotRooms,
  loadPeople, savePeople,
  loadRoster, saveRoster
} from './storage/localStorage';
import './App.css';

function App() {
  // All our data
  const [rooms, setRooms] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotRooms, setSlotRooms] = useState({});
  const [people, setPeople] = useState([]);
  const [generatedRoster, setGeneratedRoster] = useState(null);
  const [currentView, setCurrentView] = useState('setup');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successDetails, setSuccessDetails] = useState('');

  // Load saved data when app starts
  useEffect(() => {
    setRooms(loadRooms());
    setSlots(loadSlots());
    setSlotRooms(loadSlotRooms());
    setPeople(loadPeople());
    setGeneratedRoster(loadRoster());
    setIsLoaded(true);
  }, []);

  // Auto-save when data changes
  useEffect(() => {
    if (isLoaded) {
      saveRooms(rooms);
    }
  }, [rooms, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveSlots(slots);
    }
  }, [slots, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveSlotRooms(slotRooms);
    }
  }, [slotRooms, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      savePeople(people);
    }
  }, [people, isLoaded]);

  useEffect(() => {
    if (generatedRoster && isLoaded) {
      saveRoster(generatedRoster);
    }
  }, [generatedRoster, isLoaded]);

  // Generate the roster
  const handleGenerateRoster = () => {
    try {
      const roster = generateRoster(slots, slotRooms, rooms, people);
      setGeneratedRoster(roster);
      setCurrentView('roster');
      setSuccessMessage('Roster Generated Successfully');
      setSuccessDetails('');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error generating roster:', error);
      setSuccessMessage('Error Generating Roster');
      setSuccessDetails('Please check your data and try again.');
      setShowSuccess(true);
    }
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
  };

  if (currentView === 'roster' && generatedRoster) {
    return (
      <div className="app-container">
        {showSuccess && (
          <SuccessNotification
            message={successMessage}
            details={successDetails}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <RosterView
          rosterData={generatedRoster}
          slots={slots}
          rooms={rooms}
          people={people}
          onExportPDF={() => {}}
          onBack={handleBackToSetup}
        />
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px',
          zIndex: 1000 
        }}>
          <PDFExportButton
            rosterData={generatedRoster}
            slots={slots}
            rooms={rooms}
            people={people}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {showSuccess && (
        <SuccessNotification
          message={successMessage}
          details={successDetails}
          onClose={() => setShowSuccess(false)}
        />
      )}
      
      <header className="app-header">
        <h1>🎓 Exam Duty Roster Management System</h1>
        <p>Manage exam invigilation roster with intelligent allocation</p>
      </header>

      <main className="app-main">
        <section id="exam-structure">
          <div className="section-header">
            <h2> Exam Structure Setup</h2>
            <p>Define rooms and exam slots</p>
          </div>
          <RoomsManager 
            rooms={rooms} 
            setRooms={setRooms}
            slotRooms={slotRooms}
            setSlotRooms={setSlotRooms}
            generatedRoster={generatedRoster}
            setGeneratedRoster={setGeneratedRoster}
          />
          <SlotsManager 
            slots={slots} 
            setSlots={setSlots}
            rooms={rooms}
            slotRooms={slotRooms}
            setSlotRooms={setSlotRooms}
          />
        </section>

        <section id="people-setup">
          <div className="section-header">
            <h2> People Setup</h2>
            <p>Add invigilators (staff and faculty with duty limits)</p>
          </div>
          <PeopleManager people={people} setPeople={setPeople} />
        </section>

        <section id="review">
          <div className="section-header">
            <h2> Review & Generate</h2>
            <p>Review your setup and generate the roster</p>
          </div>
          <ReviewPanel
            rooms={rooms}
            slots={slots}
            slotRooms={slotRooms}
            people={people}
            onGenerate={handleGenerateRoster}
            generatedRoster={generatedRoster}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React + JavaScript | DSA: Greedy Allocation Algorithm</p>
      </footer>
    </div>
  );
}

export default App;
