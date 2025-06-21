use genpdf::Element;
use std::io;
use std::fs::File;
use genpdf::{elements, style};

fn calculate_average(total_marks: f32, subjects: u32) -> f32 {
    total_marks / subjects as f32
}

fn assign_grade(average: f32) -> &'static str {
    match average {
        x if x >= 90.0 => "A",
        x if x >= 75.0 => "B",
        x if x >= 60.0 => "C",
        _ => "D",
    }
}

fn main() {
    let mut name = String::new();
    let mut total_marks = String::new();
    let mut subjects = String::new();

    println!("Enter student name:");
    io::stdin().read_line(&mut name).unwrap();
    println!("Enter total marks obtained:");
    io::stdin().read_line(&mut total_marks).unwrap();
    println!("Enter number of subjects:");
    io::stdin().read_line(&mut subjects).unwrap();

    let name = name.trim();
    let total_marks: f32 = total_marks.trim().parse().unwrap();
    let subjects: u32 = subjects.trim().parse().unwrap();

    let average = calculate_average(total_marks, subjects);
    let grade = assign_grade(average);

    println!("Generating report card for {}", name);

    // Generate PDF
    let font_family = genpdf::fonts::from_files("./fonts", "LiberationSans", None)
        .expect("Failed to load font family");
    let mut doc = genpdf::Document::new(font_family);
    doc.set_title("Student Report Card");

    let mut decorator = genpdf::SimplePageDecorator::new();
    decorator.set_margins(10);
    doc.set_page_decorator(decorator);

    let heading = elements::Paragraph::new("Student Report Card")
        .aligned(genpdf::Alignment::Center)
        .styled(style::Style::new().bold().with_font_size(18));

    let body = elements::LinearLayout::vertical()
        .element(heading)
        .element(elements::Break::new(1))
        .element(elements::Paragraph::new(format!("Name: {}", name)))
        .element(elements::Paragraph::new(format!("Total Marks: {}", total_marks)))
        .element(elements::Paragraph::new(format!("Subjects: {}", subjects)))
        .element(elements::Paragraph::new(format!("Average: {:.2}", average)))
        .element(elements::Paragraph::new(format!("Grade: {}", grade)));

    doc.push(body);

    let output = File::create("report.pdf").expect("Failed to create file");
    doc.render(output).expect("Failed to render PDF");

    println!("PDF report card generated as 'report.pdf'");
}
