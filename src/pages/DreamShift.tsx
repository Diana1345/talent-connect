import { useMemo, useState } from "react";
import { ArrowRight, Award, BarChart3, Briefcase, CheckCircle2, Flame, Lock, LogOut, Map, Medal, Rocket, Send, Sparkles, Star, Target, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { DreamProfile, Evaluation, ExperienceLevel, Mission, WeeklyTime, evaluateSubmission, generateMission, getLevel, getRank, getReadiness, RANKS } from "@/lib/dreamshift";

const save = (profile: DreamProfile, mission: Mission, history: Evaluation[]) => {
  localStorage.setItem("dreamshift_profile", JSON.stringify(profile));
  localStorage.setItem("dreamshift_mission", JSON.stringify(mission));
  localStorage.setItem("dreamshift_history", JSON.stringify(history));
};

const loadJson = <T,>(key: string): T | null => {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
};

export default function DreamShift() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<DreamProfile | null>(() => loadJson("dreamshift_profile"));
  const [mission, setMission] = useState<Mission | null>(() => loadJson("dreamshift_mission"));
  const [history, setHistory] = useState<Evaluation[]>(() => loadJson("dreamshift_history") || []);
  const [submission, setSubmission] = useState(() => localStorage.getItem("dreamshift_draft") || "");
  const [form, setForm] = useState({ name: user?.user_metadata?.full_name || "", dreamJob: "", experienceLevel: "Beginner" as ExperienceLevel, weeklyTime: "3–7h" as WeeklyTime });

  const level = getLevel(profile?.xp || 0);
  const rank = getRank(profile?.xp || 0);
  const levelProgress = ((profile?.xp || 0) % 250) / 2.5;
  const lastEval = history[0];
  const readiness = useMemo(() => profile ? getReadiness(profile) : 0, [profile]);

  const start = () => {
    if (!form.name || !form.dreamJob) return toast.error("Add your name and dream job to begin.");
    const nextProfile: DreamProfile = { id: user?.id || crypto.randomUUID(), ...form, xp: 0, coins: 0, streak: 1, completedMissions: 0, skills: ["Career discovery"], createdAt: new Date().toISOString(), lastActive: new Date().toISOString() };
    const nextMission = generateMission(nextProfile, []);
    setProfile(nextProfile); setMission(nextMission); setHistory([]); save(nextProfile, nextMission, []);
    toast.success("Your first under-10-minute mission is ready.");
  };

  const submit = () => {
    if (!profile || !mission) return;
    if (submission.trim().length < 80) return toast.error("Add a little more detail before submitting.");
    const evaluation = evaluateSubmission(submission, mission);
    const updatedProfile: DreamProfile = {
      ...profile,
      xp: profile.xp + evaluation.xpAwarded,
      coins: profile.coins + evaluation.coinsAwarded,
      completedMissions: profile.completedMissions + 1,
      streak: profile.streak + 1,
      skills: Array.from(new Set([...profile.skills, "Decision making", "Workplace communication", mission.profession])),
      lastActive: new Date().toISOString(),
    };
    const nextHistory = [evaluation, ...history];
    const nextMission = generateMission(updatedProfile, nextHistory);
    setProfile(updatedProfile); setHistory(nextHistory); setMission(nextMission); setSubmission(""); localStorage.removeItem("dreamshift_draft"); save(updatedProfile, nextMission, nextHistory);
    toast.success(`Scored ${evaluation.score}/100. +${evaluation.xpAwarded} XP unlocked.`);
  };

  if (!profile || !mission) {
    return <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(168_80%_50%/.18),transparent_32%),linear-gradient(180deg,hsl(220_20%_6%),hsl(225_25%_4%))] px-4 py-6 text-foreground"><section className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center"><div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"><Sparkles className="h-4 w-4" /> DreamShift MVP</div><div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">Experience your dream career before choosing it.</h1><p className="mt-6 max-w-2xl text-lg text-muted-foreground">AI-generated career simulations that act like a manager and mentor: get realistic assignments, submit work, receive scoring, earn XP, and unlock harder scenarios.</p><div className="mt-8 grid gap-3 sm:grid-cols-3"><Stat icon={Briefcase} label="Real tasks" /><Stat icon={Trophy} label="XP progression" /><Stat icon={Target} label="Career clarity" /></div></div><Card className="border-white/10 bg-card/80 shadow-2xl backdrop-blur"><CardHeader><CardTitle>Create your career profile</CardTitle></CardHeader><CardContent className="space-y-4"><Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Avery" /></Field><Field label="Dream job"><Input value={form.dreamJob} onChange={(e) => setForm({ ...form, dreamJob: e.target.value })} placeholder="Product Manager, Architect, Entrepreneur..." /></Field><Field label="Experience level"><Select value={form.experienceLevel} onValueChange={(v: ExperienceLevel) => setForm({ ...form, experienceLevel: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Beginner">Beginner</SelectItem><SelectItem value="Intermediate">Intermediate</SelectItem><SelectItem value="Advanced">Advanced</SelectItem></SelectContent></Select></Field><Field label="Weekly available time"><Select value={form.weeklyTime} onValueChange={(v: WeeklyTime) => setForm({ ...form, weeklyTime: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="<3h">&lt;3h</SelectItem><SelectItem value="3–7h">3–7h</SelectItem><SelectItem value="7h+">7h+</SelectItem></SelectContent></Select></Field><Button onClick={start} className="w-full bg-gradient-primary text-primary-foreground glow-subtle">Generate profile <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card></div></section></main>;
  }

  return <main className="min-h-screen bg-background px-4 py-5"><div className="mx-auto max-w-7xl"><header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-primary"><Rocket className="h-5 w-5" /><span className="font-semibold">DreamShift</span></div><h1 className="mt-2 text-3xl font-semibold">Welcome back, {profile.name}</h1><p className="text-muted-foreground">Your simulated role: {profile.dreamJob}</p></div><Button variant="outline" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button></header><section className="grid gap-4 md:grid-cols-5"><Metric icon={Briefcase} label="Current role" value={profile.dreamJob} /><Metric icon={Medal} label="Rank" value={rank} /><Metric icon={Star} label="XP" value={profile.xp.toString()} /><Metric icon={BarChart3} label="Level" value={level.toString()} /><Metric icon={Flame} label="Streak" value={`${profile.streak} days`} /></section><Card className="mt-4 border-primary/20 bg-gradient-card"><CardContent className="pt-6"><div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">Active mission</p><h2 className="text-2xl font-semibold">{mission.title}</h2></div><div className="text-right text-sm text-muted-foreground">Next level<br/><span className="text-primary">{Math.round(levelProgress)}%</span></div></div><Progress value={levelProgress} className="mt-4" /></CardContent></Card><Tabs defaultValue="mission" className="mt-6"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="mission">Continue mission</TabsTrigger><TabsTrigger value="map">Career map</TabsTrigger><TabsTrigger value="achievements">Achievements</TabsTrigger><TabsTrigger value="profile">Profile</TabsTrigger></TabsList><TabsContent value="mission" className="grid gap-5 lg:grid-cols-[1fr_.8fr]"><Card><CardHeader><CardTitle>{mission.title}</CardTitle></CardHeader><CardContent className="space-y-5"><p className="rounded-2xl border border-white/10 bg-secondary/50 p-4 text-muted-foreground">{mission.scenario}</p><div><h3 className="font-semibold">Objective</h3><p className="text-muted-foreground">{mission.objective}</p></div><div><h3 className="font-semibold">Deliverables</h3><ul className="mt-2 space-y-2">{mission.deliverables.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />{item}</li>)}</ul></div><div className="grid gap-3 sm:grid-cols-2"><Badge label="Difficulty" value={mission.difficulty} /><Badge label="Estimated time" value={mission.estimated_time} /></div></CardContent></Card><Card><CardHeader><CardTitle>Submit your work</CardTitle></CardHeader><CardContent className="space-y-4"><Textarea className="min-h-56" value={submission} onChange={(e) => setSubmission(e.target.value)} placeholder="Write your response, notes, assumptions, and recommendation..." /><div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => { localStorage.setItem("dreamshift_draft", submission); toast.success("Draft saved."); }}>Save draft</Button><Button className="flex-1 bg-gradient-primary text-primary-foreground" onClick={submit}><Send className="mr-2 h-4 w-4" />Submit</Button></div>{lastEval && <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4"><p className="font-semibold">Latest AI evaluation: {lastEval.score}/100</p><p className="mt-2 text-sm text-muted-foreground">{lastEval.nextChallenge}</p></div>}</CardContent></Card></TabsContent><TabsContent value="map"><Card><CardHeader><CardTitle>Career map</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-7">{RANKS.map((r, i) => <div key={r} className={`rounded-2xl border p-4 ${RANKS.indexOf(rank) >= i ? "border-primary/40 bg-primary/10" : "border-white/10 bg-secondary/30"}`}>{RANKS.indexOf(rank) >= i ? <Award className="mb-3 h-5 w-5 text-primary" /> : <Lock className="mb-3 h-5 w-5 text-muted-foreground" />}<p className="font-medium">{r}</p><p className="text-xs text-muted-foreground">{i < 2 ? "Foundations" : i < 5 ? "Harder scenarios" : "Exclusive missions"}</p></div>)}</CardContent></Card></TabsContent><TabsContent value="achievements"><Card><CardHeader><CardTitle>History & achievements</CardTitle></CardHeader><CardContent className="space-y-3">{history.length === 0 ? <p className="text-muted-foreground">Complete your first mission to start your history.</p> : history.map((e) => <div key={e.id} className="rounded-2xl border border-white/10 p-4"><div className="flex justify-between"><p className="font-semibold">Score {e.score}/100</p><p className="text-primary">+{e.xpAwarded} XP</p></div><p className="mt-2 text-sm text-muted-foreground">Strength: {e.strengths[0]}</p></div>)}</CardContent></Card></TabsContent><TabsContent value="profile"><Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" /> Career profile</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Badge label="Completed missions" value={profile.completedMissions.toString()} /><Badge label="Career readiness estimate" value={`${readiness}%`} /><Badge label="Total XP" value={profile.xp.toString()} /><Badge label="Coins" value={profile.coins.toString()} /><div className="md:col-span-2"><h3 className="font-semibold">Skills gained</h3><div className="mt-2 flex flex-wrap gap-2">{profile.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-sm">{skill}</span>)}</div></div></CardContent></Card></TabsContent></Tabs></div></main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }
function Stat({ icon: Icon, label }: { icon: typeof Briefcase; label: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><Icon className="mb-3 h-5 w-5 text-primary" /><p className="font-medium">{label}</p></div>; }
function Metric({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) { return <Card><CardContent className="pt-5"><Icon className="mb-3 h-5 w-5 text-primary" /><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 truncate text-xl font-semibold">{value}</p></CardContent></Card>; }
function Badge({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-secondary/40 p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
