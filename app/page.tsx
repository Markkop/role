"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CalendarDays,
  CheckLine,
  ClipboardCopy,
  Database,
  Download,
  KeyRound,
  Loader2,
  MapPin,
  PencilLine,
  Share2,
  Sparkles,
  Settings,
  Trash2,
  Upload,
  Users,
  WandSparkles,
  X,
} from "lucide-react";

type CardItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageDetail: string;
  type: string;
  isMuted?: boolean;
};

type Section = {
  id: string;
  title: string;
  subtitle: string;
  symbol: string;
  accent: string;
  baseStyle: string;
  cards: CardItem[];
};

type AiSettings = {
  apiKey: string;
  model: string;
  aspectRatio: string;
  imageSize: string;
};

const STORAGE_KEY = "holy-card-studio-v1";
const AI_STORAGE_KEY = "holy-card-studio-ai-v1";

const DEFAULT_AI_SETTINGS: AiSettings = {
  apiKey: "",
  model: "gemini-2.5-flash-image",
  aspectRatio: "3:4",
  imageSize: "1K",
};

const AI_MODELS = [
  {
    id: "gemini-2.5-flash-image",
    label: "Nano Banana (2.5 Flash Image)",
  },
  {
    id: "gemini-3-pro-image-preview",
    label: "Nano Banana Pro (3 Pro Image)",
  },
];

const AI_ASPECT_RATIOS = ["3:4", "4:5", "2:3", "1:1", "16:9", "9:16"];
const AI_IMAGE_SIZES = ["1K", "2K", "4K"];

const initialSections: Section[] = [
  {
    id: "characters",
    title: "Characters",
    subtitle: "The people who can be part of the Holy mystery.",
    symbol: "CHAR",
    accent: "from-[color:var(--coral)] to-[color:var(--sun)]",
    baseStyle:
      "Voxel-based illustration, 3/4 corner interior view, centered full-body character, crisp block geometry, soft warm light, playful but clean palette, shallow depth, high detail.",
    cards: [
      {
        id: "mark",
        name: "Mark",
        description: "Hosts the loudest gatherings and never misses a clue.",
        image: "",
        imageDetail:
          "Young man wearing a black hat and black outfit, confident stance in a startup web development workspace with monitors and sticky notes.",
        type: "Character",
      },
      {
        id: "iosha",
        name: "Iosha",
        description: "Keeps secrets and always brings unexpected allies.",
        image: "",
        imageDetail:
          "Shorter woman with pink accents, purple t-shirt, black and white striped pants, standing on a theater stage with curtains and a spotlight.",
        type: "Character",
      },
      {
        id: "evelyn",
        name: "Evelyn",
        description: "Strategic thinker with a calm, analytical presence.",
        image: "",
        imageDetail:
          "Calm woman in a navy blazer holding a notebook, set in a quiet library corner with a warm desk lamp.",
        type: "Character",
      },
      {
        id: "bruna",
        name: "Bruna",
        description: "Life of the party with a playlist for every twist.",
        image: "",
        imageDetail:
          "Energetic woman in a bright jacket and headphones, inside a music studio with speakers and LED panels.",
        type: "Character",
      },
      {
        id: "duda",
        name: "Duda",
        description: "Always on time and always watching the room.",
        image: "",
        imageDetail:
          "Focused woman in a minimalist outfit with a smartwatch, standing near a transit hub schedule board.",
        type: "Character",
      },
      {
        id: "val",
        name: "Val",
        description: "Quick to laugh, quicker to spot contradictions.",
        image: "",
        imageDetail:
          "Playful woman wearing a colorful scarf, inside a cozy cafe with an espresso bar.",
        type: "Character",
      },
      {
        id: "gustavo",
        name: "Gustavo",
        description: "The storyteller who knows every rumor in town.",
        image: "",
        imageDetail:
          "Man in a denim jacket leaning near a bar corner with a glowing neon sign behind him.",
        type: "Character",
      },
      {
        id: "gabriela",
        name: "Gabriela",
        description: "Bright energy with a talent for improvisation.",
        image: "",
        imageDetail:
          "Woman in a green dress, standing in a dance rehearsal room with mirrors and floor markings.",
        type: "Character",
      },
      {
        id: "antonia",
        name: "Antonia",
        description: "Observant, stylish, and always three steps ahead.",
        image: "",
        imageDetail:
          "Stylish woman in a white blouse, posed in an art gallery with framed photos and spotlights.",
        type: "Character",
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    subtitle: "Where the party energy shifts the story.",
    symbol: "EVNT",
    accent: "from-[color:var(--sea)] to-[color:var(--sun)]",
    baseStyle:
      "Voxel diorama, wide interior corner scene, cinematic lighting, layered props, no main character, crisp blocks, cinematic haze, high detail.",
    cards: [
      {
        id: "birthday",
        name: "Birthday Party",
        description: "A celebration packed with candles, cake, and rumors.",
        image: "",
        imageDetail:
          "Colorful balloons, cake table with candles, confetti midair, warm string lights.",
        type: "Event",
      },
      {
        id: "wedding",
        name: "Wedding",
        description: "Formal, emotional, and full of hidden motives.",
        image: "",
        imageDetail:
          "White floral arch, elegant aisle, soft golden light, empty chairs waiting.",
        type: "Event",
      },
      {
        id: "nye",
        name: "New Year's Eve",
        description: "Countdowns, fireworks, and a midnight twist.",
        image: "",
        imageDetail:
          "City skyline backdrop, fireworks outside the window, champagne table, glowing countdown clock.",
        type: "Event",
      },
      {
        id: "carnival",
        name: "Carnival",
        description: "Masks, music, and a maze of alibis.",
        image: "",
        imageDetail:
          "Street parade scene with masks, feathers, vibrant banners, lanterns overhead.",
        type: "Event",
      },
      {
        id: "housewarming",
        name: "Housewarming",
        description: "A cozy gathering with new faces and new secrets.",
        image: "",
        imageDetail:
          "Moving boxes by a sofa, welcome sign, snacks on a coffee table, soft lamp glow.",
        type: "Event",
      },
      {
        id: "beach-bonfire",
        name: "Beach Bonfire",
        description: "Warm flames, cold drinks, and whispered deals.",
        image: "",
        imageDetail:
          "Fire pit by the sand, surfboards leaning nearby, night sky, embers floating.",
        type: "Event",
      },
    ],
  },
  {
    id: "objects",
    title: "Objects",
    subtitle: "Props, clues, and party artifacts.",
    symbol: "OBJ",
    accent: "from-[color:var(--navy)] to-[color:var(--coral)]",
    baseStyle:
      "Voxel still life, centered object on a table, dramatic spotlight, clean background, crisp block geometry, realistic textures, high detail.",
    cards: [
      {
        id: "board-game",
        name: "Board Game",
        description: "The perfect distraction hiding one more secret.",
        image: "",
        imageDetail:
          "Game box open with cards and dice scattered on a wooden table.",
        type: "Object",
      },
      {
        id: "vape",
        name: "Vape",
        description: "A trail of sweet smoke and sharper questions.",
        image: "",
        imageDetail:
          "Sleek device with a soft smoke trail and subtle neon accents.",
        type: "Object",
      },
      {
        id: "switch",
        name: "Nintendo Switch",
        description: "Controllers passed around as tension builds.",
        image: "",
        imageDetail:
          "Console with red and blue joycons, screen glowing on the tabletop.",
        type: "Object",
      },
      {
        id: "dance-shoes",
        name: "Dance Shoes",
        description: "Glitter on the floor, footsteps in the dark.",
        image: "",
        imageDetail:
          "Glitter shoes on a dance floor with a tight spotlight circle.",
        type: "Object",
      },
      {
        id: "confetti",
        name: "Confetti Cannon",
        description: "A burst of color with something hidden inside.",
        image: "",
        imageDetail:
          "Party cannon mid-pop with confetti exploding outward.",
        type: "Object",
      },
      {
        id: "polaroid",
        name: "Polaroid Camera",
        description: "Instant photos that reveal more than expected.",
        image: "",
        imageDetail:
          "Vintage instant camera with printed photos fanned beside it.",
        type: "Object",
      },
    ],
  },
  {
    id: "places",
    title: "Places",
    subtitle: "The locations that frame the Holy story.",
    symbol: "PLC",
    accent: "from-[color:var(--sun)] to-[color:var(--sea)]",
    baseStyle:
      "Voxel environment, wide-angle corner view, no characters, layered depth, soft atmospheric light, crisp block geometry, high detail.",
    cards: [
      {
        id: "mark-house",
        name: "Mark's House",
        description: "The main gathering spot, full of familiar clues.",
        image: "",
        imageDetail:
          "Modern living room with a laptop on the couch, city night visible through the window.",
        type: "Place",
      },
      {
        id: "centro",
        name: "Centro de Florianopolis",
        description: "Busy streets, bright lights, and endless alibis.",
        image: "",
        imageDetail:
          "Urban street corner with buses, street lamps, and storefront glow.",
        type: "Place",
      },
      {
        id: "lagoa",
        name: "Lagoa da Conceicao",
        description: "Waterside hangout with a mix of locals and visitors.",
        image: "",
        imageDetail:
          "Lakeside deck with palm trees and calm water reflections.",
        type: "Place",
      },
      {
        id: "parque",
        name: "Parque Botanico",
        description: "Shaded paths that hide quiet conversations.",
        image: "",
        imageDetail:
          "Green park path with benches, layered tree canopy, dappled light.",
        type: "Place",
      },
      {
        id: "udesc",
        name: "UDESC",
        description: "Campus energy with after-hours secrets.",
        image: "",
        imageDetail:
          "Campus courtyard with stairs, banners, and late-night glow.",
        type: "Place",
      },
      {
        id: "beira-mar",
        name: "Beira-Mar",
        description: "A waterfront stretch for fast getaways.",
        image: "",
        imageDetail:
          "Waterfront promenade with a bike lane and distant skyline.",
        type: "Place",
      },
      {
        id: "lagoon-house",
        name: "Lakeside House",
        description: "An isolated retreat with a view of the water.",
        image: "",
        imageDetail:
          "Quiet house by the water with a small dock and misty air.",
        type: "Place",
      },
    ],
  },
];

const cloneSections = (sections: Section[]) =>
  sections.map((section) => ({
    ...section,
    cards: section.cards.map((card) => ({
      ...card,
      isMuted: card.isMuted ?? false,
    })),
  }));

const getFirstSelection = (sections: Section[]) => ({
  sectionId: sections[0]?.id ?? "",
  cardId: sections[0]?.cards[0]?.id ?? "",
});

const serializeSections = (sections: Section[]) => JSON.stringify(sections);

const stripInlineImages = (sections: Section[]) =>
  sections.map((section) => ({
    ...section,
    cards: section.cards.map((card) =>
      card.image.startsWith("data:") ? { ...card, image: "" } : card
    ),
  }));

const MAX_LOCAL_STORAGE_CHARS = 3_200_000;

const serializeSectionsForStorage = (sections: Section[]) => {
  const serialized = serializeSections(sections);
  if (serialized.length <= MAX_LOCAL_STORAGE_CHARS) return serialized;
  return serializeSections(stripInlineImages(sections));
};

const safeSetLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const isString = (value: unknown): value is string => typeof value === "string";
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

const isCardItem = (value: unknown): value is CardItem => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (record.isMuted !== undefined && !isBoolean(record.isMuted)) return false;
  return (
    isString(record.id) &&
    isString(record.name) &&
    isString(record.description) &&
    isString(record.image) &&
    isString(record.imageDetail) &&
    isString(record.type)
  );
};

const isSection = (value: unknown): value is Section => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    isString(record.id) &&
    isString(record.title) &&
    isString(record.subtitle) &&
    isString(record.symbol) &&
    isString(record.accent) &&
    isString(record.baseStyle) &&
    Array.isArray(record.cards) &&
    record.cards.every(isCardItem)
  );
};

const safeParseSections = (raw: string): Section[] | null => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isSection)) {
      return cloneSections(parsed);
    }
  } catch {
    return null;
  }
  return null;
};

const safeParseAiSettings = (raw: string): AiSettings | null => {
  try {
    const parsed = JSON.parse(raw) as Partial<AiSettings>;
    if (
      parsed &&
      isString(parsed.apiKey ?? "") &&
      isString(parsed.model ?? "") &&
      isString(parsed.aspectRatio ?? "") &&
      isString(parsed.imageSize ?? "")
    ) {
      return {
        apiKey: parsed.apiKey ?? "",
        model: parsed.model || DEFAULT_AI_SETTINGS.model,
        aspectRatio: parsed.aspectRatio || DEFAULT_AI_SETTINGS.aspectRatio,
        imageSize: parsed.imageSize || DEFAULT_AI_SETTINGS.imageSize,
      };
    }
  } catch {
    return null;
  }
  return null;
};

const encodeShareString = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const decodeShareString = (value: string) => {
  try {
    let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
};

const parseImportPayload = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const share =
        url.searchParams.get("share") ||
        new URLSearchParams(url.hash.replace("#", "")).get("share");
      if (share) {
        const decoded = decodeShareString(share);
        return decoded ? safeParseSections(decoded) : null;
      }
    } catch {
      return null;
    }
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return safeParseSections(trimmed);
  }

  const decoded = decodeShareString(trimmed);
  return decoded ? safeParseSections(decoded) : null;
};

const getShareParam = () => {
  const url = new URL(window.location.href);
  return (
    url.searchParams.get("share") ||
    new URLSearchParams(url.hash.replace("#", "")).get("share")
  );
};

const buildShareUrl = (share: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("share", share);
  url.hash = "";
  return url.toString();
};

const buildImageDescription = (section: Section, card: CardItem) => {
  const base = section.baseStyle.trim();
  const detail = card.imageDetail.trim();
  if (!base) return detail;
  if (!detail) return base;
  return `${base} ${detail}`;
};

const sectionIconMap = {
  characters: Users,
  events: CalendarDays,
  objects: Box,
  places: MapPin,
} as const;

const getSectionIcon = (sectionId: string) => {
  return sectionIconMap[sectionId as keyof typeof sectionIconMap] ?? Sparkles;
};

export default function Home() {
  const [sections, setSections] = useState<Section[]>(() =>
    cloneSections(initialSections)
  );
  const [selection, setSelection] = useState(() =>
    getFirstSelection(initialSections)
  );
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [styleEditorSectionId, setStyleEditorSectionId] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);
  const [dataPanelOpen, setDataPanelOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [dataInput, setDataInput] = useState("");
  const [importError, setImportError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [aiSettings, setAiSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS);
  const [aiError, setAiError] = useState("");
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "running" | "paused" | "stopped" | "completed"
  >("idle");
  const [generationProgress, setGenerationProgress] = useState({
    done: 0,
    total: 0,
  });
  const [generationScope, setGenerationScope] = useState("All cards");
  const [generatingCards, setGeneratingCards] = useState<Record<string, boolean>>(
    {}
  );
  const generationQueueRef = useRef<Array<{ section: Section; card: CardItem }>>(
    []
  );
  const generationIndexRef = useRef(0);
  const generationControlRef = useRef({
    paused: false,
    stopped: false,
    running: false,
  });

  useEffect(() => {
    let loaded = false;
    const shareParam = getShareParam();
    if (shareParam) {
      const decoded = decodeShareString(shareParam);
      const parsed = decoded ? safeParseSections(decoded) : null;
      if (parsed) {
        setSections(parsed);
        setSelection(getFirstSelection(parsed));
        loaded = true;
        localStorage.setItem(STORAGE_KEY, serializeSections(parsed));
      }
    }

    if (!loaded) {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? safeParseSections(stored) : null;
      if (parsed) {
        setSections(parsed);
        setSelection(getFirstSelection(parsed));
      }
    }

    const aiStored = localStorage.getItem(AI_STORAGE_KEY);
    const parsedAi = aiStored ? safeParseAiSettings(aiStored) : null;
    if (parsedAi) {
      setAiSettings(parsedAi);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const primary = serializeSectionsForStorage(sections);
    if (safeSetLocalStorage(STORAGE_KEY, primary)) return;
    const fallback = serializeSections(stripInlineImages(sections));
    safeSetLocalStorage(STORAGE_KEY, fallback);
  }, [sections, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiSettings));
  }, [aiSettings, hydrated]);

  const activeSection = useMemo(() => {
    return sections.find((section) => section.id === selection.sectionId) ??
      sections[0];
  }, [sections, selection.sectionId]);

  const activeCard = useMemo(() => {
    return (
      activeSection.cards.find((card) => card.id === selection.cardId) ??
      activeSection.cards[0]
    );
  }, [activeSection, selection.cardId]);

  const updateActiveCard = (field: keyof CardItem, value: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== activeSection.id) return section;
        return {
          ...section,
          cards: section.cards.map((card) =>
            card.id === activeCard.id ? { ...card, [field]: value } : card
          ),
        };
      })
    );
  };

  const updateSectionStyle = (sectionId: string, value: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, baseStyle: value } : section
      )
    );
  };

  const toggleCardMuted = (sectionId: string, cardId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: section.cards.map((card) =>
            card.id === cardId
              ? { ...card, isMuted: !card.isMuted }
              : card
          ),
        };
      })
    );
  };

  const updateCardImage = (
    sectionId: string,
    cardId: string,
    image: string
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: section.cards.map((card) =>
            card.id === cardId ? { ...card, image } : card
          ),
        };
      })
    );
  };

  const totalCards = sections.reduce(
    (sum, section) => sum + section.cards.length,
    0
  );

  const getCardKey = (sectionId: string, cardId: string) =>
    `${sectionId}:${cardId}`;

  const setGeneratingCard = (key: string, value: boolean) => {
    setGeneratingCards((prev) => ({ ...prev, [key]: value }));
  };

  const activeCardKey = getCardKey(activeSection.id, activeCard.id);
  const isGeneratingActive = Boolean(generatingCards[activeCardKey]);
  const fullPrompt = buildImageDescription(activeSection, activeCard);
  const hasApiKey = Boolean(aiSettings.apiKey.trim());
  const canGenerateActive = Boolean(hasApiKey && fullPrompt.trim());
  const isBatchRunning =
    generationStatus === "running" || generationStatus === "paused";
  const ActiveSectionIcon = getSectionIcon(activeSection.id);

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(
        buildImageDescription(activeSection, activeCard)
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const generateImageForCard = async (
    section: Section,
    card: CardItem,
    options?: { force?: boolean }
  ) => {
    const prompt = buildImageDescription(section, card);
    if (!prompt.trim()) return;
    if (!aiSettings.apiKey.trim()) {
      setAiError("Add a Gemini API key to generate images.");
      return;
    }
    if (!options?.force && card.image.trim()) return;

    const cardKey = getCardKey(section.id, card.id);
    setGeneratingCard(cardKey, true);
    setAiError("");

    try {
      const payload: Record<string, unknown> = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: aiSettings.aspectRatio,
          },
        },
      };

      if (aiSettings.model === "gemini-3-pro-image-preview") {
        (payload.generationConfig as Record<string, unknown>).imageConfig = {
          aspectRatio: aiSettings.aspectRatio,
          imageSize: aiSettings.imageSize,
        };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${aiSettings.model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": aiSettings.apiKey.trim(),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        const message =
          data?.error?.message || "Image generation failed. Check your API key.";
        setAiError(message);
        return;
      }

      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const inlineData = (parts.find(
        (part: Record<string, unknown>) => part.inlineData
      )?.inlineData ??
        parts.find((part: Record<string, unknown>) => part.inline_data)
          ?.inline_data) as
        | { data?: string; mimeType?: string; mime_type?: string }
        | undefined;

      if (!inlineData?.data) {
        setAiError("No image returned. Try adjusting the prompt.");
        return;
      }

      const mimeType = inlineData.mimeType || inlineData.mime_type || "image/png";
      const dataUrl = `data:${mimeType};base64,${inlineData.data}`;
      updateCardImage(section.id, card.id, dataUrl);
    } catch {
      setAiError("Image generation failed. Please try again.");
    } finally {
      setGeneratingCard(cardKey, false);
    }
  };

  const handleGenerateActive = async () => {
    await generateImageForCard(activeSection, activeCard, { force: true });
  };

  const waitForResume = () =>
    new Promise<void>((resolve) => {
      const interval = window.setInterval(() => {
        if (
          !generationControlRef.current.paused ||
          generationControlRef.current.stopped
        ) {
          window.clearInterval(interval);
          resolve();
        }
      }, 200);
    });

  const runGenerationQueue = async () => {
    const queue = generationQueueRef.current;
    const total = queue.length;
    generationControlRef.current.running = true;
    setGenerationStatus("running");
    setGenerationProgress({ done: generationIndexRef.current, total });

    while (generationIndexRef.current < total) {
      if (generationControlRef.current.stopped) break;
      if (generationControlRef.current.paused) {
        setGenerationStatus("paused");
        await waitForResume();
        if (generationControlRef.current.stopped) break;
        setGenerationStatus("running");
      }

      const { section, card } = queue[generationIndexRef.current];
      // eslint-disable-next-line no-await-in-loop
      await generateImageForCard(section, card);
      generationIndexRef.current += 1;
      setGenerationProgress({ done: generationIndexRef.current, total });
    }

    generationControlRef.current.running = false;
    if (generationControlRef.current.stopped) {
      setGenerationStatus("stopped");
    } else {
      setGenerationStatus("completed");
    }
  };

  const buildGenerationQueue = (scope?: Section) => {
    const source = scope ? [scope] : sections;
    return source.flatMap((section) =>
      section.cards
        .filter(
          (card) => card.imageDetail.trim().length > 0 && !card.image.trim()
        )
        .map((card) => ({ section, card }))
    );
  };

  const startGeneration = (scope?: Section) => {
    if (!aiSettings.apiKey.trim()) {
      setAiError("Add a Gemini API key to generate images.");
      return;
    }
    setAiError("");
    const queue = buildGenerationQueue(scope);
    generationQueueRef.current = queue;
    generationIndexRef.current = 0;
    generationControlRef.current = {
      paused: false,
      stopped: false,
      running: false,
    };
    setGenerationScope(scope ? scope.title : "All cards");
    if (queue.length === 0) {
      setGenerationStatus("completed");
      setGenerationProgress({ done: 0, total: 0 });
      return;
    }
    runGenerationQueue();
  };

  const pauseGeneration = () => {
    if (generationStatus !== "running") return;
    generationControlRef.current.paused = true;
    setGenerationStatus("paused");
  };

  const resumeGeneration = () => {
    if (generationStatus !== "paused") return;
    generationControlRef.current.paused = false;
    setGenerationStatus("running");
  };

  const stopGeneration = () => {
    generationControlRef.current.stopped = true;
    generationControlRef.current.paused = false;
  };

  const handleShare = async () => {
    try {
      const share = encodeShareString(serializeSections(sections));
      const shareUrl = buildShareUrl(share);
      await navigator.clipboard.writeText(shareUrl);
      window.history.replaceState(null, "", shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
    } catch {
      setShareCopied(false);
    }
  };

  const handleExport = async () => {
    try {
      await navigator.clipboard.writeText(serializeSections(sections));
      setExportCopied(true);
      window.setTimeout(() => setExportCopied(false), 1600);
    } catch {
      setExportCopied(false);
    }
  };

  const handleImportReplace = () => {
    const parsed = parseImportPayload(dataInput);
    if (!parsed) {
      setImportError("Import failed. Use JSON or a share string.");
      return;
    }
    setSections(parsed);
    setSelection(getFirstSelection(parsed));
    setDataInput("");
    setImportError("");
  };

  const handleClearAll = () => {
    const fresh = cloneSections(initialSections);
    setSections(fresh);
    setSelection(getFirstSelection(fresh));
    setDataInput("");
    setImportError("");
    setAiSettings(DEFAULT_AI_SETTINGS);
    setAiError("");
    generationControlRef.current.stopped = true;
    generationControlRef.current.paused = false;
    setGenerationStatus("idle");
    setGenerationProgress({ done: 0, total: 0 });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AI_STORAGE_KEY);
    const url = new URL(window.location.href);
    url.searchParams.delete("share");
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-fade animate-shimmer" />
      <div className="pointer-events-none absolute inset-0 grain opacity-60" />
      <main className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)]">
            Holy Card Studio
            <Sparkles className="h-4 w-4 text-[color:var(--coral)]" />
            {totalCards} cards
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-4xl leading-tight text-[color:var(--navy)] sm:text-5xl">
              Build the Holy card deck in one page.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--ink)]/80">
              Tap any card to edit the name, description, or image URL. This
              prototype mirrors the Holy party game structure inspired by
              classic deduction games, with categories for characters, events,
              objects, and places.
            </p>
          </div>
        </header>

        {!hasApiKey ? (
          <section className="card-frame rounded-3xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
                  <KeyRound className="h-5 w-5 text-[color:var(--navy)]" />
                </span>
                <div className="font-display text-lg text-[color:var(--navy)]">
                  Connect a Gemini API key to generate images
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiPanelOpen(true)}
                className="flex items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
              >
                <Settings className="mr-2 h-4 w-4" />
                Open AI settings
              </button>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                  Instant setup
                </div>
                <ol className="mt-3 grid gap-2 text-sm text-[color:var(--ink)]/70">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--navy)]/10 text-[0.65rem] font-semibold text-[color:var(--navy)]">
                      1
                    </span>
                    <span>
                      Create a Gemini API key in{" "}
                      <a
                        className="text-[color:var(--coral)] underline decoration-[color:var(--coral)]/40 underline-offset-4"
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Google AI Studio
                      </a>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--navy)]/10 text-[0.65rem] font-semibold text-[color:var(--navy)]">
                      2
                    </span>
                    <span>Paste it here to save instantly in this browser.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--navy)]/10 text-[0.65rem] font-semibold text-[color:var(--navy)]">
                      3
                    </span>
                    <span>Generate images from any card or section.</span>
                  </li>
                </ol>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                  Paste your key
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink)]/50" />
                    <input
                      type="password"
                      value={aiSettings.apiKey}
                      onChange={(event) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          apiKey: event.target.value,
                        }))
                      }
                      placeholder="AIza..."
                      className="w-full rounded-2xl border border-[color:var(--navy)]/15 bg-white px-9 py-2 text-sm text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiPanelOpen(true)}
                    className="flex h-9 items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                  >
                    More
                  </button>
                </div>
                <div className="mt-2 text-xs text-[color:var(--ink)]/60">
                  Saved locally in this browser. You can clear it anytime.
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="card-frame rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
                <Database className="h-5 w-5 text-[color:var(--navy)]" />
              </span>
              <div className="font-display text-lg text-[color:var(--navy)]">
                Manage
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Copy share link"
                title="Copy share link"
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-[color:var(--navy)] transition ${
                  shareCopied
                    ? "border-[color:var(--sea)] bg-[color:var(--sea)]/10 text-[color:var(--sea)]"
                    : "border-[color:var(--navy)]/20 bg-white/80 hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                }`}
              >
                {shareCopied ? (
                  <CheckLine className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={handleExport}
                aria-label="Copy JSON export"
                title="Copy JSON export"
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-[color:var(--navy)] transition ${
                  exportCopied
                    ? "border-[color:var(--sea)] bg-[color:var(--sea)]/10 text-[color:var(--sea)]"
                    : "border-[color:var(--navy)]/20 bg-white/80 hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                }`}
              >
                {exportCopied ? (
                  <CheckLine className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setDataPanelOpen((prev) => !prev)}
                aria-label={dataPanelOpen ? "Close import panel" : "Open import panel"}
                title={dataPanelOpen ? "Close import panel" : "Open import panel"}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-[color:var(--navy)] transition ${
                  dataPanelOpen
                    ? "border-[color:var(--coral)] bg-[color:var(--coral)]/10 text-[color:var(--coral)]"
                    : "border-[color:var(--navy)]/20 bg-white/80 hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                }`}
              >
                <Upload className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setAiPanelOpen((prev) => !prev)}
                aria-label={aiPanelOpen ? "Close AI settings" : "Open AI settings"}
                title={aiPanelOpen ? "Close AI settings" : "Open AI settings"}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-[color:var(--navy)] transition ${
                  aiPanelOpen
                    ? "border-[color:var(--coral)] bg-[color:var(--coral)]/10 text-[color:var(--coral)]"
                    : "border-[color:var(--navy)]/20 bg-white/80 hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                }`}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                aria-label="Clear all data"
                title="Clear all data"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {dataPanelOpen || aiPanelOpen ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                  Export JSON
                </div>
                <textarea
                  value={serializeSections(sections)}
                  readOnly
                  rows={6}
                  className="mt-3 w-full rounded-2xl border border-[color:var(--navy)]/10 bg-white/60 px-4 py-3 text-xs text-[color:var(--navy)]"
                />
                <div className="mt-2 text-xs text-[color:var(--ink)]/60">
                  Use the download icon to copy the JSON.
                </div>
              </div>
              {dataPanelOpen ? (
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                    Import / Replace
                  </div>
                  <textarea
                    value={dataInput}
                    onChange={(event) => setDataInput(event.target.value)}
                    rows={6}
                    placeholder="Paste JSON, a share string, or a full share URL."
                    className="mt-3 w-full rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-3 text-xs text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-[color:var(--coral)]">
                      {importError}
                    </span>
                    <button
                      type="button"
                      onClick={handleImportReplace}
                      className="flex items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Replace
                    </button>
                  </div>
                </div>
              ) : null}
              {aiPanelOpen ? (
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                      AI settings (Gemini)
                    </div>
                    <span className="rounded-full bg-[color:var(--navy)]/10 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--navy)]">
                      Client key
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                      API key
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink)]/50" />
                        <input
                          type="password"
                          value={aiSettings.apiKey}
                          onChange={(event) =>
                            setAiSettings((prev) => ({
                              ...prev,
                              apiKey: event.target.value,
                            }))
                          }
                          placeholder="AIza..."
                          className="w-full rounded-2xl border border-[color:var(--navy)]/15 bg-white px-9 py-2 text-sm text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAiSettings((prev) => ({ ...prev, apiKey: "" }))
                        }
                        aria-label="Clear API key"
                        title="Clear API key"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xs text-[color:var(--ink)]/60">
                      Stored locally in this browser. Clear all data to remove it.
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                        Model
                      </label>
                      <select
                        value={aiSettings.model}
                        onChange={(event) =>
                          setAiSettings((prev) => ({
                            ...prev,
                            model: event.target.value,
                          }))
                        }
                        className="rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-xs text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                      >
                        {AI_MODELS.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                        Aspect ratio
                      </label>
                      <select
                        value={aiSettings.aspectRatio}
                        onChange={(event) =>
                          setAiSettings((prev) => ({
                            ...prev,
                            aspectRatio: event.target.value,
                          }))
                        }
                        className="rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-xs text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                      >
                        {AI_ASPECT_RATIOS.map((ratio) => (
                          <option key={ratio} value={ratio}>
                            {ratio}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {aiSettings.model === "gemini-3-pro-image-preview" ? (
                    <div className="mt-4 flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                        Image size
                      </label>
                      <select
                        value={aiSettings.imageSize}
                        onChange={(event) =>
                          setAiSettings((prev) => ({
                            ...prev,
                            imageSize: event.target.value,
                          }))
                        }
                        className="rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-xs text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                      >
                        {AI_IMAGE_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-[color:var(--coral)]">
                      {aiError}
                    </span>
                    <div className="flex items-center gap-2">
                      {generationStatus === "running" ? (
                        <button
                          type="button"
                          onClick={pauseGeneration}
                          className="flex items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                        >
                          Pause
                        </button>
                      ) : null}
                      {generationStatus === "paused" ? (
                        <button
                          type="button"
                          onClick={resumeGeneration}
                          className="flex items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                        >
                          Resume
                        </button>
                      ) : null}
                      {generationStatus === "running" ||
                      generationStatus === "paused" ? (
                        <button
                          type="button"
                          onClick={stopGeneration}
                          className="flex items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                        >
                          Stop
                        </button>
                      ) : null}
                      {generationStatus === "idle" ||
                      generationStatus === "stopped" ||
                      generationStatus === "completed" ? (
                        <button
                          type="button"
                          onClick={() => startGeneration()}
                          disabled={!aiSettings.apiKey.trim()}
                          className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                            !aiSettings.apiKey.trim()
                              ? "border-[color:var(--navy)]/10 bg-white/60 text-[color:var(--navy)]/50"
                              : "border-[color:var(--navy)]/20 bg-white/80 text-[color:var(--navy)] hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                          }`}
                        >
                          <WandSparkles className="h-4 w-4" />
                          {generationStatus === "idle" ? "Generate all" : "Start over"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--ink)]/60">
                    {generationProgress.total
                      ? `${generationScope}: ${generationProgress.done}/${generationProgress.total} done`
                      : "Generate all fills empty image slots with image details."}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <div className="flex flex-col gap-12">
          {sections.map((section) => (
            <section key={section.id} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div
                  className={`h-1 w-16 rounded-full bg-gradient-to-r ${section.accent}`}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl text-[color:var(--navy)]">
                      {section.title}
                    </h2>
                    <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/70">
                      {section.cards.length} cards
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startGeneration(section)}
                      disabled={isBatchRunning || !aiSettings.apiKey.trim()}
                      aria-label={`Generate images for ${section.title}`}
                      title={`Generate images for ${section.title}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-[color:var(--navy)] transition ${
                        isBatchRunning || !aiSettings.apiKey.trim()
                          ? "border-[color:var(--navy)]/10 bg-white/60 text-[color:var(--navy)]/50"
                          : "border-[color:var(--navy)]/20 bg-white/80 hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                      }`}
                    >
                      <WandSparkles className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStyleEditorSectionId((current) =>
                          current === section.id ? null : section.id
                        )
                      }
                      className="rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                    >
                      <PencilLine className="mr-2 inline-flex h-4 w-4" />
                      {styleEditorSectionId === section.id
                        ? "Close style"
                        : "Edit style"}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[color:var(--ink)]/70">
                  {section.subtitle}
                </p>
              </div>

              {styleEditorSectionId === section.id ? (
                <div className="rounded-3xl border border-white/70 bg-white/80 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                    Base image style for {section.title}
                  </div>
                  <textarea
                    value={section.baseStyle}
                    onChange={(event) =>
                      updateSectionStyle(section.id, event.target.value)
                    }
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-3 text-sm text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                  />
                </div>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.cards.map((card, index) => {
                    const isActive =
                      selection.sectionId === section.id &&
                      selection.cardId === card.id;
                    const SectionIcon = getSectionIcon(section.id);

                    const isMuted = Boolean(card.isMuted);

                    return (
                      <div
                        key={card.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelection({ sectionId: section.id, cardId: card.id });
                          setDialogOpen(true);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelection({ sectionId: section.id, cardId: card.id });
                            setDialogOpen(true);
                          }
                        }}
                        style={{ animationDelay: `${index * 45}ms` }}
                        className={`card-frame animate-float-in group relative flex aspect-[3/4] h-full cursor-pointer flex-col items-center rounded-3xl p-4 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_-45px_rgba(17,42,70,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)] ${
                          isActive ? "ring-accent" : ""
                        }`}
                        aria-pressed={isActive}
                      >
                        <button
                          type="button"
                          aria-label="Toggle grayscale"
                          title="Toggle grayscale"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleCardMuted(section.id, card.id);
                          }}
                          className="absolute right-3 top-3 h-6 w-6 rounded-full bg-transparent opacity-0"
                        />
                        <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--ink)]/60">
                          {card.type}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-[color:var(--navy)]">
                          {card.name}
                        </div>
                        <div className="card-image-mask mt-3 flex-1 w-full overflow-hidden rounded-2xl border border-white/70">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.name}
                              className={`h-full w-full object-cover ${
                                isMuted ? "grayscale" : ""
                              }`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[color:var(--ink)]/50">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex items-center justify-center">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80"
                            aria-label={`${section.title} card`}
                            title={`${section.title} card`}
                          >
                            <SectionIcon className="h-4 w-4 text-[color:var(--navy)]" />
                          </span>
                        </div>
                      </div>
                    );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {isDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
          onClick={() => setDialogOpen(false)}
        >
          <div
            className="card-frame w-full max-w-5xl rounded-3xl bg-white/95 p-6 shadow-[0_40px_120px_-60px_rgba(17,42,70,0.8)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                {activeSection.title} - {activeCard.type}
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 text-[color:var(--navy)] transition hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_360px]">
              <div className="flex items-center justify-center">
                <div className="card-frame flex w-full max-w-sm flex-col items-center rounded-3xl p-5 text-center">
                  <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--ink)]/60">
                    {activeCard.type}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--navy)]">
                    {activeCard.name}
                  </div>
                  <div className="card-image-mask mt-4 aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/70">
                    {activeCard.image ? (
                      <img
                        src={activeCard.image}
                        alt={activeCard.name}
                        className={`h-full w-full object-cover ${
                          activeCard.isMuted ? "grayscale" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[color:var(--ink)]/50">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80"
                      aria-label={`${activeSection.title} card`}
                      title={`${activeSection.title} card`}
                    >
                      <ActiveSectionIcon className="h-4 w-4 text-[color:var(--navy)]" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                    Name
                  </label>
                  <input
                    value={activeCard.name}
                    onChange={(event) => updateActiveCard("name", event.target.value)}
                    className="rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-sm text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                    Description
                  </label>
                  <textarea
                    value={activeCard.description}
                    onChange={(event) =>
                      updateActiveCard("description", event.target.value)
                    }
                    rows={3}
                    className="rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-sm text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                      Image URL
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateActive}
                      disabled={!canGenerateActive || isGeneratingActive}
                      aria-label="Generate image with AI"
                      title={
                        canGenerateActive
                          ? "Generate image with AI"
                          : "Add an API key and prompt to generate"
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-[color:var(--navy)] transition ${
                        isGeneratingActive
                          ? "border-[color:var(--sea)] bg-[color:var(--sea)]/10 text-[color:var(--sea)]"
                          : "border-[color:var(--navy)]/20 bg-white/80 hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                      } ${!canGenerateActive || isGeneratingActive ? "opacity-60" : ""}`}
                    >
                      {isGeneratingActive ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <WandSparkles className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <input
                    value={activeCard.image}
                    onChange={(event) =>
                      updateActiveCard("image", event.target.value)
                    }
                    placeholder="https://"
                    className="rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-sm text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                    Image detail
                  </label>
                  <textarea
                    value={activeCard.imageDetail}
                    onChange={(event) =>
                      updateActiveCard("imageDetail", event.target.value)
                    }
                    rows={3}
                    className="rounded-2xl border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-sm text-[color:var(--navy)] focus:border-[color:var(--coral)] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                    Full image description
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyDescription}
                    aria-label="Copy full image description"
                    title="Copy full image description"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[color:var(--navy)] transition ${
                      copied
                        ? "border-[color:var(--sea)] bg-[color:var(--sea)]/10 text-[color:var(--sea)]"
                        : "border-[color:var(--navy)]/20 bg-white/80 hover:border-[color:var(--coral)] hover:text-[color:var(--coral)]"
                    }`}
                  >
                    {copied ? (
                      <CheckLine className="h-4 w-4" />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
