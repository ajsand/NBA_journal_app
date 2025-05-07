import Dexie from 'dexie';

export const db = new Dexie('NBAFanJournalDB');

db.version(1).stores({
  entries: '++id, title, type, dateCreated, dateModified',
  tags: '++id, name, category'
});

const initialTags = [
  // Teams
  { name: 'Lakers', category: 'Team' },
  { name: 'Celtics', category: 'Team' },
  { name: 'Warriors', category: 'Team' },
  { name: 'Bucks', category: 'Team' },
  { name: 'Nuggets', category: 'Team' },
  { name: 'Suns', category: 'Team' },
  { name: 'Knicks', category: 'Team' },
  { name: 'Bulls', category: 'Team' },
  
  // Players
  { name: 'Durant', category: 'Player' },
  { name: 'James', category: 'Player' },
  { name: 'Curry', category: 'Player' },
  { name: 'Antetokounmpo', category: 'Player' },
  { name: 'Jokic', category: 'Player' },
  
  // Custom 
  { name: 'Stats', category: 'Custom' },
  { name: 'Games', category: 'Custom' },
  { name: 'Players', category: 'Custom' },
  { name: 'Rookies', category: 'Custom' },
  { name: 'Playoffs', category: 'Custom' },
  { name: 'Free Agency', category: 'Custom' },
  { name: 'Awards', category: 'Custom' },
  { name: 'Defense', category: 'Custom' },
];

const sampleEntries = [
  {
    title: "Durant's Scoring Milestone",
    body: "<p>Kevin Durant reached 30,000 career points tonight, becoming only the 7th player in NBA history to reach this milestone. It was a special moment in an otherwise routine regular season game against the Rockets.</p><p>Durant needed 18 points coming into tonight's game to reach the mark. He hit the milestone on a smooth mid-range jumper from his favorite spot on the right elbow with 4:32 remaining in the second quarter.</p><p>The 30K club is extremely exclusive, with Durant joining LeBron James, Kareem Abdul-Jabbar, Karl Malone, Kobe Bryant, Michael Jordan, and Dirk Nowitzki. What makes Durant's achievement especially impressive is his efficiency - he has the highest career field goal percentage and three-point percentage of anyone in this elite group.</p><p>At 36 years old, Durant shows no signs of slowing down. He's averaging 26.3 PPG this season on 52% shooting. If he maintains this level of play for another 2-3 seasons, he could potentially climb as high as 4th on the all-time scoring list.</p>",
    type: "Commentary",
    tagIds: [9, 14],
    dateCreated: new Date(2025, 3, 18, 10, 32),
    dateModified: new Date(2025, 3, 18, 10, 32)
  },
  {
    title: "Lakers vs Celtics Game Analysis",
    body: "<p>The Lakers showed impressive defensive coordination in tonight's game against the Celtics. LeBron's leadership was on full display as they contained Tatum for most of the night. Their help defense rotation was the best I've seen all season.</p><p>Davis anchored the paint with 4 blocks, but it was the perimeter defense from Reaves and Russell that really made the difference. They forced the Celtics into tough shots all night.</p><p>On offense, the Lakers' ball movement created open looks consistently. They finished with 28 assists on 42 made field goals. LeBron's vision in transition led to several highlight plays.</p><p>This was a statement win against the defending champions and shows the Lakers might have the defensive identity needed for a deep playoff run.</p>",
    type: "Commentary",
    tagIds: [1, 2, 16],
    dateCreated: new Date(2025, 3, 23, 9, 15),
    dateModified: new Date(2025, 3, 23, 9, 15)
  },
  {
    title: "Top 5 MVP Candidates",
    body: "<p>My updated MVP rankings after this week's games. Jokić continues to dominate with his all-around play, averaging a near triple-double while leading the Nuggets to the West's top seed.</p><p>1. Nikola Jokić - Still the front-runner with his consistent excellence</p><p>2. Luka Dončić - Carrying the Mavs with historic offensive numbers</p><p>3. Giannis Antetokounmpo - The Bucks have surged with his return to form</p><p>4. Shai Gilgeous-Alexander - Leading the Thunder's surprising rise</p><p>5. Joel Embiid - Missing games hurts his case, but dominant when on the floor</p><p>I'm particularly impressed with SGA's defensive improvement this season. He's gone from being just an offensive star to a complete two-way player.</p>",
    type: "Commentary",
    tagIds: [13, 21],
    dateCreated: new Date(2025, 3, 21, 14, 45),
    dateModified: new Date(2025, 3, 21, 14, 45)
  },
  {
    title: "Conference Finals Prediction",
    body: "<p>I'm predicting the Nuggets will defeat the Timberwolves in 6 games. Denver's experience and home court advantage will be the deciding factors.</p><p>The Nuggets' championship experience from last year gives them a mental edge in close games. Jokić continues to be unstoppable, and Murray has elevated his game in the playoffs once again.</p><p>Minnesota's defense has been spectacular, but they struggle with consistent half-court offense in crunch time. Edwards needs more help when teams lock in on him.</p><p>Denver in 6 is my official prediction, with Jokić averaging close to a triple-double for the series.</p>",
    type: "Commentary",
    tagIds: [5, 19],
    dateCreated: new Date(2025, 3, 20, 8, 30),
    dateModified: new Date(2025, 3, 20, 8, 30)
  },
  {
    title: "Rookie Performance Review",
    body: "<p>The 2024 rookie class has been impressive so far. Thompson is averaging 16.8 PPG and 7.2 RPG while showing great defensive instincts.</p><p>Miller has been the most NBA-ready, contributing immediately to a playoff team. His shooting has translated perfectly to the pro level.</p><p>Wagner shows flashes of brilliance but struggles with consistency. His ceiling might be the highest of the group.</p><p>The biggest surprise has been Johnson, a second-round pick who's already carved out a rotation role with his energy and defensive versatility.</p><p>Overall, this looks like one of the deeper rookie classes in recent memory, with 7-8 players who could be long-term starters or better.</p>",
    type: "Commentary",
    tagIds: [17, 18],
    dateCreated: new Date(2025, 3, 15, 16, 20),
    dateModified: new Date(2025, 3, 15, 16, 20)
  }
];

// Initialize database with seed data if empty
db.on('ready', async () => {
  const tagCount = await db.tags.count();
  const entryCount = await db.entries.count();
  
  if (tagCount === 0 && entryCount === 0) {
    try {
      // Clear existing data
      await db.transaction('rw', db.tags, db.entries, async () => {
        await db.tags.clear();
        await db.entries.clear();
        
        // Insert all initial tags
        const tagIds = await db.tags.bulkAdd(initialTags, { allKeys: true });
        console.log('Added tags:', tagIds);
        
        // Add all sample entries
        const entryIds = await db.entries.bulkAdd(sampleEntries, { allKeys: true });
        console.log('Added entries:', entryIds);
      });
      
      console.log('Database initialized with seed data');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
});

export default db;
