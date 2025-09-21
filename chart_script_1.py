import plotly.graph_objects as go
import plotly.io as pio

# Data for the flowchart
data = {
    "flowchart_steps": [
        {"step": 1, "title": "Mam dziesiątki aplikacji HTML", "type": "start", "description": "Punkt wyjścia"},
        {"step": 2, "title": "Wybierz platformę hostingu", "type": "decision", "options": ["GitHub Pages", "Google Sites", "Netlify", "Własny hosting"]},
        {"step": 3, "title": "Zorganizuj strukturę plików", "type": "process", "description": "Uporządkuj aplikacje w folderach"},
        {"step": 4, "title": "Stwórz dashboard nawigacyjny", "type": "process", "description": "Centralny panel do zarządzania"},
        {"step": 5, "title": "Połącz z AI (opcjonalne)", "type": "optional", "description": "Integracja z asystentem AI"},
        {"step": 6, "title": "Utwórz przeszukiwalną bazę", "type": "process", "description": "Dodaj wyszukiwarkę i kategoryzację"},
        {"step": 7, "title": "Gotowy system", "type": "end", "description": "Kompleksowy portal aplikacji"}
    ]
}

# Define positions for flowchart nodes (wider layout)
positions = {
    1: (2, 6),    # Start - top center
    2: (2, 5),    # Decision 
    3: (2, 4),    # Process
    4: (2, 3),    # Process
    5: (2, 2),    # Optional
    6: (2, 1),    # Process
    7: (2, 0)     # End - bottom center
}

# Abbreviate titles to fit 15 character limit but keep readable
abbreviated_titles = {
    1: "Dziesiątki HTML",
    2: "Wybierz hosting", 
    3: "Struktura plików",
    4: "Dashboard nav.",
    5: "AI (opcjonalne)",
    6: "Przeszuk. baza",
    7: "Gotowy system"
}

# Color mapping for different step types
color_map = {
    "start": "#1FB8CD",     # Strong cyan
    "decision": "#DB4545",   # Bright red  
    "process": "#2E8B57",    # Sea green
    "optional": "#5D878F",   # Cyan
    "end": "#D2BA4C"        # Moderate yellow
}

# Symbol mapping for different step types
symbol_map = {
    "start": "circle",
    "decision": "diamond",
    "process": "square",
    "optional": "square",
    "end": "circle"
}

# Create figure
fig = go.Figure()

# Add nodes with different shapes based on type
for step_data in data["flowchart_steps"]:
    step_num = step_data["step"]
    x, y = positions[step_num]
    step_type = step_data["type"]
    
    # Create hover text
    hover_text = step_data['title']
    if "description" in step_data:
        hover_text += f"<br>{step_data['description']}"
    if "options" in step_data:
        hover_text += "<br>Options: " + ", ".join(step_data["options"])
    
    # Adjust marker size based on type
    marker_size = 120 if step_type == "decision" else 100
    
    # Add trace for each node
    fig.add_trace(go.Scatter(
        x=[x],
        y=[y],
        mode='markers+text',
        marker=dict(
            size=marker_size,
            color=color_map[step_type],
            symbol=symbol_map[step_type],
            line=dict(
                width=4 if step_type == "optional" else 2, 
                color='white' if step_type != "optional" else '#13343B'
            )
        ),
        text=abbreviated_titles[step_num],
        textposition='middle center',
        textfont=dict(size=12, color='white'),
        hovertext=hover_text,
        hoverinfo='text',
        showlegend=False,
        name=f"Step {step_num}"
    ))

# Add arrows between steps
for i in range(1, 7):  # Connect steps 1-6 to next step
    x1, y1 = positions[i]
    x2, y2 = positions[i + 1]
    
    # Adjust offset based on shape
    current_type = data["flowchart_steps"][i-1]["type"]
    next_type = data["flowchart_steps"][i]["type"]
    
    offset1 = 0.2 if current_type == "decision" else 0.15
    offset2 = 0.2 if next_type == "decision" else 0.15
    
    # Add arrow line
    fig.add_trace(go.Scatter(
        x=[x1, x2],
        y=[y1 - offset1, y2 + offset2],
        mode='lines',
        line=dict(color='#13343B', width=4),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add arrowhead
    fig.add_trace(go.Scatter(
        x=[x2],
        y=[y2 + offset2 + 0.05],
        mode='markers',
        marker=dict(
            size=20,
            color='#13343B',
            symbol='triangle-up'
        ),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add legend for step types
legend_items = [
    ("Start/End", "#1FB8CD", "circle"),
    ("Decision", "#DB4545", "diamond"),
    ("Process", "#2E8B57", "square"),
    ("Optional", "#5D878F", "square")
]

for i, (label, color, symbol) in enumerate(legend_items):
    fig.add_trace(go.Scatter(
        x=[0.2],
        y=[5.5 - i * 0.3],
        mode='markers+text',
        marker=dict(
            size=30,
            color=color,
            symbol=symbol,
            line=dict(width=4 if label == "Optional" else 2, color='white' if label != "Optional" else '#13343B')
        ),
        text=label,
        textposition='middle right',
        textfont=dict(size=10, color='#13343B'),
        showlegend=False,
        hoverinfo='skip'
    ))

# Update layout
fig.update_layout(
    title="HTML Apps Org Flow",
    xaxis=dict(
        range=[-0.5, 4.5],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    yaxis=dict(
        range=[-0.5, 6.5],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    plot_bgcolor='white',
    showlegend=False
)

fig.update_traces(cliponaxis=False)

# Save as both PNG and SVG
fig.write_image("flowchart.png")
fig.write_image("flowchart.svg", format="svg")

fig.show()